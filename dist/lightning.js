import { NativeEventEmitter, NativeModules, DeviceEventEmitter, Platform, } from 'react-native';
import { failure, getKeychainValue, nap, secureRandomPassword, setKeychainValue, success, toCaps, } from './utils/lib';
import base64 from 'base64-js';
import { lnrpc } from './rpc';
import { defaultLndConfig } from './utils/lnd.conf';
const seedKey = 'lightningMnemonic';
const passwordKey = 'lightningPassword';
class LndInterface {
    constructor() {
        this.isReady = false;
        this.isLndStarted = false;
        this._lnd = NativeModules.RnMylnd;
        this._streamCounter = 0;
        this._lndEvent =
            Platform.OS == 'android'
                ? DeviceEventEmitter
                : new NativeEventEmitter(NativeModules.RnMylnd);
    }
    /**
     * Start LND
     * @param config
     * config sample
     * {
        'bitcoin.regtest': 150,
        'no-macaroons': 980,
        'bitcoin.active': 9622,
        'bitcoin.node': 'NUU',
        'newConfig.value': 'test',
      };
     * @returns {Promise<Response>}
     */
    async start(config = {}) {
        let lndConf = defaultLndConfig;
        if (Object.keys(config).length) {
            for (let key of Object.keys(config)) {
                let value = config[key];
                if (lndConf.includes(key))
                    lndConf = lndConf.replace(new RegExp(`(${key}=)(.*?)[\n]`), `${key}=${value}\n`);
                else
                    lndConf = `${lndConf}${key}=${value}\n`;
            }
        }
        try {
            if (this.isLndStarted)
                return failure('LND is already started !!');
            await this._lnd.start(lndConf);
            this.isLndStarted = true;
            return success();
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Generates wallet seed phrase which can be used in initWallet
     * @return {Promise<Response>}
     */
    async genSeed() {
        try {
            const seed = await this._lnd.genSeed();
            return success(seed.join(' '));
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Generates wallet random password which can be used in initWallet
     * @return {Promise<Response>}
     */
    async genPassword() {
        try {
            const password = await secureRandomPassword();
            return success(password);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Store seed string to keychain
     * @param seed
     * @returns {Promise<void>}
     */
    async storeSeedToKeychain(seed) {
        await setKeychainValue({
            key: seedKey,
            value: seed,
        });
    }
    /**
     * Get seed value from keychain
     * @returns {Promise<Response>}
     */
    async getSeedFromKeychain() {
        return await getKeychainValue({
            key: seedKey,
        });
    }
    /**
     * Store password to keychain
     * @param password
     * @returns {Promise<void>}
     */
    async storePasswordToKeychain(password) {
        await setKeychainValue({
            key: passwordKey,
            value: password,
        });
    }
    /**
     * Get password from keychain
     * @returns {Promise<Response>}
     */
    async getPasswordFromKeychain() {
        return await getKeychainValue({
            key: passwordKey,
        });
    }
    /**
     *  Initwallet with/without seed and password
     * @param seed
     * @param password
     * @returns {Promise<Response>}
     */
    async initWallet(seed = '', password = '') {
        try {
            const walletExists = await this._exists();
            if (walletExists)
                return failure('Wallet already initialised!!');
            if (seed === '') {
                let seedRes = await this.genSeed();
                seed = seedRes.data;
            }
            if (password === '') {
                let passwordRes = await this.genPassword();
                password = passwordRes.data;
            }
            //Set the new lightning mnemonic & pass
            await Promise.all([
                await this.storeSeedToKeychain(seed),
                await this.storePasswordToKeychain(password),
                nap(5000),
            ]);
            const seedArray = seed.split(' ');
            const res = await this._lnd.createWallet(password, seedArray);
            this.isReady = true;
            return success({ message: res, seed: seed, password: password });
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Determines if a wallet has already been initialized for the network specified.
     * @param  {string} Network (bitcoin, testnet, regtest)
     * @return {Promise<Response>}
     */
    async walletExists(network) {
        try {
            const exists = await this._exists(network);
            return success({ exists });
        }
        catch (e) {
            return failure(e);
        }
    }
    async _exists(network = 'regtest') {
        return await this._lnd.walletExists(network);
    }
    /**
     * Unlock wallet if already exists
     * @returns {Promise<Response>}
     */
    async unlockWallet() {
        try {
            const lightningPass = await this.getPasswordFromKeychain();
            if (lightningPass.error === false && lightningPass.data.password) {
                const res = await this._lnd.unlock(lightningPass.data.password);
                this.isReady = true;
                return success(res);
            }
            else {
                return failure(lightningPass.data);
            }
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Generate new address for wallet
     * @returns {Promise<Response>}
     */
    async newAddress() {
        try {
            if (!this.isReady)
                return failure();
            const newAddressResponse = await this._lnrpcRequest('newAddress', {
                type: 'p2pkh',
            });
            if (newAddressResponse.address)
                return success(newAddressResponse.address);
            return failure('Unable to generate address.');
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * fetch wallet balance
     * @returns {Promise<Response>}
     */
    async walletBalance() {
        try {
            if (!this.isReady)
                return failure();
            const response = await this._lnrpcRequest('WalletBalance');
            return success({
                totalBalance: response.totalBalance || 0,
                confirmedBalance: response.confirmedBalance || 0,
                unconfirmedBalance: response.unconfirmedBalance || 0,
            });
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Send the coins to specified address
     * @param {*} addr
     * @param {*} amt
     * @returns {Promise<Response>}
     */
    async sendCoins(addr, amount) {
        try {
            if (!this.isReady)
                await this.start();
            const response = await this._lnrpcRequest('SendCoins', {
                addr,
                amount,
            });
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Connect to peer
     * @param pubkey
     * @param host
     * @returns {Promise<Response>}
     */
    async connectPeer(pubkey = '', host = '') {
        try {
            if (!this.isReady)
                await this.start();
            try {
                await this._lnrpcRequest('connectPeer', {
                    addr: { host, pubkey },
                });
                return success(`Connected to ${pubkey}@${host}`);
            }
            catch (err) {
                return failure(err);
            }
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * get list of connected peers
     * @returns {Promise<Response>}
     */
    async listPeers() {
        try {
            if (!this.isReady)
                await this.start();
            const response = await this._lnrpcRequest('listPeers');
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * get list of connected peers
     * @returns {Promise<Response>}
     */
    async getInfo() {
        try {
            const response = await this._lnrpcRequest('getInfo');
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Open channel for amount and public key
     * @param pubkey
     * @param local_amount
     * @param remote_amount
     * @returns {Promise<Response>}
     */
    async openChannel(pubkey, local_amount, remote_amount = 0) {
        try {
            if (!this.isReady)
                await this.start();
            const requestParams = {
                nodePubkeyString: pubkey,
                localFundingAmount: local_amount,
            };
            if (remote_amount !== 0)
                requestParams.pushSat = remote_amount;
            const openChannelResponse = await this._lnrpcRequest('OpenChannelSync', requestParams);
            return success(openChannelResponse);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * get list of connected channels
     * @returns {Promise<Response>}
     */
    async listChannels() {
        try {
            if (!this.isReady)
                await this.start();
            const response = await this._lnrpcRequest('ListChannels');
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * get channel balance
     * @returns {Promise<Response>}
     */
    async channelBalance() {
        try {
            if (!this.isReady)
                await this.start();
            const response = await this._lnrpcRequest('ChannelBalance');
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * get channel and wallet balance
     * @returns {Promise<Response>}
     */
    async allBalance() {
        try {
            const channelBalance = await this.channelBalance();
            const walletBalance = await this.walletBalance();
            const response = `OnChain Balance: ${JSON.stringify(walletBalance.data)} \n\n Channel Balance: ${JSON.stringify(channelBalance.data)}`;
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Add invoice
     * @param amount
     * @param memo
     * @returns {Promise<Response>}
     */
    async addInvoice(amount, memo = '') {
        try {
            if (!this.isReady)
                await this.start();
            const response = await this._lnrpcRequest('addInvoice', {
                value: amount,
                memo,
            });
            const invoice = response.paymentRequest;
            return success(invoice);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * decode payment request returned by addInvoice
     * @param payReq
     * @returns {Promise<Response>}
     */
    async decodePayReq(payReq = '') {
        if (!this.isReady)
            await this.start();
        const request = { payReq };
        try {
            const response = await this._lnrpcRequest('DecodePayReq', request);
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * send payment
     * @param payReq
     * @returns {Promise<Response>}
     */
    async sendPayment(payReq) {
        if (!this.isReady)
            await this.start();
        const request = {
            paymentRequest: payReq,
        };
        try {
            const response = await this._lnrpcRequest('SendPaymentSync', request);
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    //
    // Helper functions
    //
    async _lnrpcRequest(method, body = {}) {
        try {
            method = toCaps(method);
            const req = this._serializeRequest(method, body);
            const response = await this._lnd.sendCommand(method, req);
            return this._deserializeResponse(method, response.data);
        }
        catch (err) {
            if (typeof err === 'string') {
                throw new Error(err);
            }
            else {
                throw err;
            }
        }
    }
    _serializeRequest(method, body = {}) {
        const req = lnrpc[this._getRequestName(method)];
        const message = req.create(body);
        const buffer = req.encode(message).finish();
        return base64.fromByteArray(buffer);
    }
    _deserializeResponse(method, response) {
        const res = lnrpc[this._getResponseName(method)];
        const buffer = base64.toByteArray(response);
        return res.decode(buffer);
    }
    _serializeResponse(method, body = {}) {
        const res = lnrpc[this._getResponseName(method)];
        const message = res.create(body);
        const buffer = res.encode(message).finish();
        return base64.fromByteArray(buffer);
    }
    _getRequestName(method) {
        const map = {
            AddInvoice: 'Invoice',
            DecodePayReq: 'PayReqString',
            ListInvoices: 'ListInvoiceRequest',
            SendPayment: 'SendRequest',
            SendPaymentSync: 'SendRequest',
            SendPaymentV2: 'SendRequest',
            SubscribeTransactions: 'GetTransactionsRequest',
            SubscribeInvoices: 'InvoiceSubscription',
            SubscribeChannelBackups: 'ChannelBackupSubscription',
            StopDaemon: 'StopRequest',
            TrackPayment: 'TrackPaymentRequest',
            OpenChannelSync: 'OpenChannelRequest',
        };
        return map[method] || `${method}Request`;
    }
    _getResponseName(method) {
        const map = {
            DecodePayReq: 'PayReq',
            GetTransactions: 'TransactionDetails',
            ListInvoices: 'ListInvoiceResponse',
            SendPayment: 'SendResponse',
            SendPaymentSync: 'SendResponse',
            SendPaymentV2: 'SendResponse',
            OpenChannel: 'OpenStatusUpdate',
            CloseChannel: 'CloseStatusUpdate',
            SubscribeTransactions: 'Transaction',
            SubscribeInvoices: 'Invoice',
            SubscribeChannelBackups: 'ChanBackupSnapshot',
            StopDaemon: 'StopResponse',
            TrackPayment: 'TrackPaymentResponse',
            OpenChannelSync: 'ChannelPoint',
        };
        return map[method] || `${method}Response`;
    }
    _generateStreamId() {
        this._streamCounter = this._streamCounter + 1;
        return String(this._streamCounter);
    }
}
const lightning = new LndInterface();
export default lightning;
