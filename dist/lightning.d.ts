import type { RnMylndType, Response } from './utils/interfaces';
declare class LndInterface {
    isReady: boolean;
    isLndStarted: boolean;
    _lnd: RnMylndType;
    _streamCounter: number;
    _lndEvent: any;
    constructor();
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
    start(config?: any): Promise<Response>;
    /**
     * Generates wallet seed phrase which can be used in initWallet
     * @return {Promise<Response>}
     */
    genSeed(): Promise<Response>;
    /**
     * Generates wallet random password which can be used in initWallet
     * @return {Promise<Response>}
     */
    genPassword(): Promise<Response>;
    /**
     * Store seed string to keychain
     * @param seed
     * @returns {Promise<void>}
     */
    storeSeedToKeychain(seed: string): Promise<void>;
    /**
     * Get seed value from keychain
     * @returns {Promise<Response>}
     */
    getSeedFromKeychain(): Promise<Response>;
    /**
     * Store password to keychain
     * @param password
     * @returns {Promise<void>}
     */
    storePasswordToKeychain(password: string): Promise<void>;
    /**
     * Get password from keychain
     * @returns {Promise<Response>}
     */
    getPasswordFromKeychain(): Promise<Response>;
    /**
     *  Initwallet with/without seed and password
     * @param seed
     * @param password
     * @returns {Promise<Response>}
     */
    initWallet(seed?: string, password?: string): Promise<Response>;
    /**
     * Determines if a wallet has already been initialized for the network specified.
     * @param  {string} Network (bitcoin, testnet, regtest)
     * @return {Promise<Response>}
     */
    walletExists(network: string): Promise<{
        error: boolean;
        data: any;
    }>;
    _exists(network?: string): Promise<boolean>;
    /**
     * Unlock wallet if already exists
     * @returns {Promise<Response>}
     */
    unlockWallet(): Promise<Response>;
    /**
     * Generate new address for wallet
     * @returns {Promise<Response>}
     */
    newAddress(): Promise<Response>;
    /**
     * fetch wallet balance
     * @returns {Promise<Response>}
     */
    walletBalance(): Promise<Response>;
    /**
     * Send the coins to specified address
     * @param {*} addr
     * @param {*} amt
     * @returns {Promise<Response>}
     */
    sendCoins(addr: string, amount: number): Promise<Response>;
    /**
     * Connect to peer
     * @param pubkey
     * @param host
     * @returns {Promise<Response>}
     */
    connectPeer(pubkey?: string, host?: string): Promise<Response>;
    /**
     * get list of connected peers
     * @returns {Promise<Response>}
     */
    listPeers(): Promise<Response>;
    /**
     * get list of connected peers
     * @returns {Promise<Response>}
     */
    getInfo(): Promise<Response>;
    /**
     * Open channel for amount and public key
     * @param pubkey
     * @param local_amount
     * @param remote_amount
     * @returns {Promise<Response>}
     */
    openChannel(pubkey: string, local_amount: number, remote_amount?: number): Promise<Response>;
    /**
     * get list of connected channels
     * @returns {Promise<Response>}
     */
    listChannels(): Promise<Response>;
    /**
     * get channel balance
     * @returns {Promise<Response>}
     */
    channelBalance(): Promise<Response>;
    /**
     * get channel and wallet balance
     * @returns {Promise<Response>}
     */
    allBalance(): Promise<Response>;
    /**
     * Add invoice
     * @param amount
     * @param memo
     * @returns {Promise<Response>}
     */
    addInvoice(amount: number, memo?: string): Promise<Response>;
    /**
     * decode payment request returned by addInvoice
     * @param payReq
     * @returns {Promise<Response>}
     */
    decodePayReq(payReq?: string): Promise<Response>;
    /**
     * send payment
     * @param payReq
     * @returns {Promise<Response>}
     */
    sendPayment(payReq: any): Promise<Response>;
    _lnrpcRequest(method: string, body?: any): Promise<any>;
    _serializeRequest(method: string, body?: {}): any;
    _deserializeResponse(method: string, response: any): any;
    _serializeResponse(method: string, body?: {}): any;
    _getRequestName(method: string): any;
    _getResponseName(method: string): any;
    _generateStreamId(): string;
}
declare const lightning: LndInterface;
export default lightning;
