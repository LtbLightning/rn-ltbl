# Let there be Lightning!

`**rn-ltbl**` is a React Native module to add LND lightning node to mobile app. This is a simple library providing all LND commands from react native context. Onchain and offchain balances along with all LND commands including channel management. There is no need to build mobile binaries and add them to the project as the latest LND version has already been built for IOS and Android and configured and packaged with the module. This module has been built to make implementing lightning in mobile apps simple for developers in addtion, for users it eliminates the need to have their own node. This allows for fully non custodial lightning network implementation.

This is an ⍺ release please use with caution and use on mainnet at your own risk, no guarantees!

This module has been inspired by many projects out there in the wild, some of which are mentioned and acknowledged [here](#thanks-to-the-following-for-inspiring-this-project)

## Table of Contents
- [Requirements](#requirements)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Library API](#library-api)

## Requirements
- Node version: >= v12
- React Native version: >= v0.64, please follow [requirements](https://github.com/facebook/react-native/tree/0.64-stable#-requirements) for react-native requirements. 
## Features

- LND Neutrino node plus all LND method calls from React Native.

## Installation

Using npm:

```bash
$ npm install rn-ltbl, react-native-randombytes, react-native-keychain
```

Using yarn:

```bash
$ yarn add rn-ltbl, react-native-randombytes, react-native-keychain
```

[IOS Only] Install pods:

```bash
npx pod-install
or
cd ios && pod install
```

## Usage

```js
import lightning from 'rn-ltbl';

// ...

await lightning.start();
```

## Library API

All LND methods work in iOS: ✅

All LND methods work in Android: ✅

**All methods return response as follows:**

```js
Promise<Response> = {
  success: true | false; // Method call success return true else return false.
  data: string | object | any; // Different response data based on method call.
}
```

Following methods can be used with this module. All methods can be called by **_lightning_** object. Parameters with asterisk(\*)** are mandatory. Please refer to https://api.lightning.community for LND API spec together with info on parameters

_lightning.start()_ OR _lightning.genSeed()_

| Method                                                | Request Parameters                  |
| ----------------------------------------------------- | ----------------------------------- |
| [start(config={})](#start)                            |                                     |
| [genSeed()](#genseed)                                 | -                                   |
| [getSeedFromKeychain()](#getseedfromkeychain)         | -                                   |
| [genPassword()](#genpassword)                         | -                                   |
| [getPasswordFromKeychain()](#getpasswordfromkeychain) | -                                   |
| [initWallet()](#initwallet)                           | seed, password                      |
| [walletExists()](#walletexists)                       | network\*                           |
| [unlockWallet()](#unlockwallet)                       | -                                   |
| [newAddress()](#newaddress)                           | -                                   |
| [walletBalance()](#walletbalance)                     | -                                   |
| [sendCoins()](#sendcoins)                             | address*, amount*                   |
| [connectPeer()](#connectpeer)                         | pubkey*, host:port*                 |
| [listPeers()](#listpeers)                             | -                                   |
| [getInfo()](#getinfo)                                 | -                                   |
| [openChannel()](#openchannel)                         | pubkey*, local_amount*, push_amount |
| [listChannels()](#listchannels)                       | -                                   |
| [channelBalance()](#channelbalance)                   | -                                   |
| [addInvoice()](#addinvoice)                           | amount*, memo*                      |
| [decodePayReq()](#decodepayreq)                       | payment_request\*                   |
| [sendpayment()](#sendPayment)                         | payment_request\*                   |

---

### start()

This will start LND.

_config Parameter (optional)_

Any number of parameters can be specified for `lnd.conf`. Please refer to [sample-lnd.conf](https://github.com/lightningnetwork/lnd/blob/master/sample-lnd.conf) for details of all the parameters that can be used in config.

To override default values, create a config object with the values you would like to use as `lnd.conf` and pass the config object as a parameter to `start()`

Following are the default values for lnd.conf file. Please follow `src/utils/lnd.conf.ts`

```js
const config = {
    // [Application options]
    "debuglevel": "info",
    "no-macaroons": 1,
    "maxbackoff": '2s',
    "nolisten": 1,
    "norest": 1,
    "sync-freelist": 1,
    "accept-keysend": 1,

    // [Routing]
    "routing.assumechanvalid": 1,

    // [Bitcoin]
    "bitcoin.active": 1,
    "bitcoin.regtest": 0,
    "bitcoin.testnet": 1,
    "bitcoin.node": "bitcoind", // bitcoind or neutrino

    // [Bitcoind]
    "bitcoind.rpchost": "127.0.0.1:19832",
    "bitcoind.rpcuser": "admin",
    "bitcoind.rpcpass": "admin",
    "bitcoind.zmqpubrawblock": "127.0.0.1:28332",
    "bitcoind.zmqpubrawtx": "127.0.0.1:28333",

    // [Neutrino]
    "neutrino.addpeer": "faucet.lightning.community",
    "neutrino.feeurl": "https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json",

    // [autopilot]
    "autopilot.active": 0,
    "autopilot.private": 0, 
    "autopilot.minconfs": 0,
    "autopilot.conftarget": 30,
    "autopilot.allocation": 1.0,
    "autopilot.heuristic": "externalscore:0.95",
    "autopilot.heuristic": "preferential:0.05"
}

// Starting LND node with the created config object

const response = await lightning.start(config);

```

Starting with default values:

```js
const response = await lightning.start({});
if (res.error == false) {
  setContent('LND started');
} else {
  setContent(`Failed to start LND: ${res.data}`);
}
```

Start LND for NNeutrinouterino Node with _testnet_ or _mainnet_.

Config for testnet
```js
let config = {
  "bitcoin.node": "neutrino",
  "bitcoin.regtest": 0,
  "bitcoin.mainnet": 0,
  "bitcoin.testnet": 1,
}
```

Config for mainnet
```js
let config = {
  "bitcoin.node": "neutrino",
  "bitcoin.regtest": 0,
  "bitcoin.mainnet": 1,
  "bitcoin.testnet": 0,
}
```

---

### genSeed()

Generate random words seed.

```js
const response = await lightning.genSeed();
// able potato affair child cage lyrics vivid increase metal actual rib rail hello muffin leg tiger often arrive across story powder auction trial ahead
```

---

### getSeedFromKeychain()

Get stored seed from keyChain.

```js
const response = await lightning.getSeedFromKeychain();
// able potato affair child cage lyrics vivid increase metal actual rib rail hello muffin leg tiger often arrive across story powder auction trial ahead
```

---

### genPassword()

Generate random characters password.

```js
const response = await lightning.genPassword();
// f51b1f1dd727ff2e77e1a1a193946794c75c63a71c1e18e35d7d5c359c0a9827
```

---

### getPasswordFromKeychain()

Get stored password from keyChain.

```js
const response = await lightning.getPasswordFromKeychain();
// f51b1f1dd727ff2e77e1a1a193946794c75c63a71c1e18e35d7d5c359c0a9827
```

---

### initWallet()

Initialize wallet.

User can specify their custom seed and password OR can generate from genSeed(), genPassword() methods and pass to initWallet.
If seed and password are not passed then seed and password will be generate automatically and used for initialising wallet.
Return seed and password after successful initialization of Wallet.

```js
const response = await lightning.initWallet(seed, password);
```

Returned response example:

```js
{
    success: true,
    data: {
        message: "initialized",
        seed: "able potato affair.....n",
        password: "f51b1f1dd727ff2e77e1a1a193946794c75c6...n"
    }
}
```

---

### walletExists()

Check is wallet is already exists or not.
Required params: network

```js
let network = 'testnet'; // testnet | regtest | mainnet
const response = await lightning.walletExists(netowrk);
// true | false
```

---

### unlockWallet()

Unlock wallet if already exists.

```js
const response = await lightning.unlockWallet();
// Wallet unlocked
```

---

### newAddress()

Creates a new address under control of the local wallet.

Api Reference: https://api.lightning.community/#newaddress

```js
const response = await lightning.newAddress();
// tb1qm3cs8xafwavhzt32qmqd98dwyqtuckhj9neksh
```

---

### walletBalance()

Get balance of wallet: https://api.lightning.community/#walletbalance

```js
const response = await lightning.walletBalance();
// {"totalBalance":3000,"confirmedBalance":3000,"unconfirmedBalance":0}
```

---

### sendCoins()

Executes a request to send coins to a particular address. https://api.lightning.community/#sendcoins

Required params: address, amount

```js
let address = 'tb1qhmk3ftsyctxf2st2fwnprwc0gl708f685t0j3t'; // Wallet address
let amount = '2000'; // amount in satoshis
const response = await lightning.sendcoins(address, amount);
// {"txid":"68270ac02efec0c7b803393b1393d2771622accaa8a37750b49e4efd31fd3178"}
```

---

### connectPeer()

Attempts to establish a connection to a remote peer. https://api.lightning.community/#connectpeer

Required params: pubkey, host

```js
let pubkey =
  '031601b20a57e1482c97ec9314e897d5e6e25a48f54ae92c59c2951eb34474035d'; // Node public key
let host = '127.0.0.1:9738'; // host:port
const response = await lightning.connectPeer(pubkey, host);
// Connected to 031601b20a57e1482c97ec9314e897d5e6e25a48f54ae92c59c2951eb34474035d@127.0.0.1:9738
```

---

### listPeers()

Returns a verbose listing of all currently active peers. https://api.lightning.community/#listpeers

```js
const response = await lightning.listPeers();
// <array Peer>
```

Example

```js
{"peers":[{"pubKey":"025c8325a8ef931d1b29be82dd6c9a57047cb5f9d202f1a8e9812e4f3892938f7b","address":"192.168.83.192:9739","bytesSent":"345","bytesRecv":"99","syncType":"ACTIVE_SYNC","features":{"0":{"name":"data-loss-protect","isRequired":true,"isKnown":true},"5":{"name":"upfront-shutdown-script","isKnown":true},"7":{"name":"gossip-queries","isKnown":true},"9":{"name":"tlv-onion","isKnown":true},"12":{"name":"static-remote-key","isRequired":true,"isKnown":true},"14":{"name":"payment-addr","isRequired":true,"isKnown":true},"17":{"name":"multi-path-payments","isKnown":true}},"flapCount":1,"lastFlapNs":"1640242291561241000"}]}
```

---

### getInfo()

Returns general information concerning the lightning node including it's identity pubkey, alias, the chains it is connected to, and information concerning the number of open+pending channels. https://api.lightning.community/#getinfo

```js
const response = await lightning.getInfo();
// {information object}
```

Example

```js
{"identityPubkey":"02dcac4b73e84ea09092a985ea4b78de73d619ce218b9fb1b22070c48e9f64f040","alias":"02dcac4b73e84ea09092","numActiveChannels":1,"numPeers":1,"blockHeight":237,"blockHash":"475705ddb0c8911dd51ebba5833483b03ec076ee4e3e8a909b348c957cdc8f6a","syncedToChain":true,"bestHeaderTimestamp":"1640242433","version":"0.14.1-beta commit=","chains":[{"chain":"bitcoin","network":"regtest"}],"color":"#3399ff","syncedToGraph":true,"features":{"0":{"name":"data-loss-protect","isRequired":true,"isKnown":true},"5":{"name":"upfront-shutdown-script","isKnown":true},"7":{"name":"gossip-queries","isKnown":true},"9":{"name":"tlv-onion","isKnown":true},"12":{"name":"static-remote-key","isRequired":true,"isKnown":true},"14":{"name":"payment-addr","isRequired":true,"isKnown":true},"17":{"name":"multi-path-payments","isKnown":true},"23":{"name":"anchors-zero-fee-htlc-tx","isKnown":true},"30":{"name":"amp","isRequired":true,"isKnown":true},"31":{"name":"amp","isKnown":true},"45":{"name":"explicit-commitment-type","isKnown":true},"2023":{"name":"script-enforced-lease","isKnown":true}}}
```

---

### openChannel()

Attempts to open a singly funded channel specified in the request to a remote peer. https://api.lightning.community/#openchannel

Required params: pubkey, local_amount

Optional params: remote_amount

```js
// Node public key
let pubkey = '031601b20a57e1482c97ec9314e897d5e6e25a48f54ae92c59c295';
// number of satoshis
let local_amount = '50000';
// number of satoshis. it should be less than local_amount.
let remote_amount = '30000';
const response = await lightning.connectPeer(
  pubkey,
  local_amount,
  remote_amount
);
// {"fundingTxidBytes":"sKAiNrzE8VDyP/3uGsp3H8Y0QtvMNroD84DtJN1c1fA="}
```

---

### listChannels()

Returns a description of all the open channels that this node is a participant in. https://api.lightning.community/#listchannels

```js
const response = await lightning.listChannels();
// <array Channel>
```

Example

```js
{"channels":[{"active":true,"remotePubkey":"025c8325a8ef931d1b29be82dd6c9a57047cb5f9d202f1a8e9812e4f3892938f7b","channelPoint":"f0d55cdd24ed80f303ba36ccdb4234c61f77ca1aeefd3ff250f1c4bc3622a0b0:0","chanId":"255086697709568","capacity":"50000","localBalance":"10950","remoteBalance":"30000","commitFee":"9050","commitWeight":"724","feePerKw":"12500","csvDelay":144,"initiator":true,"chanStatusFlags":"ChanStatusDefault","localChanReserveSat":"500","remoteChanReserveSat":"500","staticRemoteKey":true,"lifetime":"4","uptime":"4","commitmentType":"ANCHORS","pushAmountSat":"30000","localConstraints":{"csvDelay":144,"chanReserveSat":"500","dustLimitSat":"354","maxPendingAmtMsat":"49500000","minHtlcMsat":"1","maxAcceptedHtlcs":483},"remoteConstraints":{"csvDelay":144,"chanReserveSat":"500","dustLimitSat":"500","maxPendingAmtMsat":"49500000","minHtlcMsat":"1","maxAcceptedHtlcs":483}}]}
```

---

### channelBalance()

Returns a report on the total funds across all open channels, categorized in local/remote, pending local/remote and unsettled local/remote balances. https://api.lightning.community/#channelbalance

```js
const response = await lightning.channelBalance();
// {"localBalance":{},"remoteBalance":{},"unsettledLocalBalance":{},"unsettledRemoteBalance":{},"pendingOpenLocalBalance":{},"pendingOpenRemoteBalance":{}}
```

---

### addInvoice()

Attempts to add a new invoice to the invoice database. https://api.lightning.community/#addinvoice

Required params: amount

Optional params: memo

```js
let amount = 1000; // number of satoshis
let memo = 'Optional memo name';

const response = await lightning.addInvoice(amount, memo);
// PaymentRequest
// "lnbcrt12u1psug8jnpp5xfhxfuek7vpnq9yeauxlwgx53nssrknam4ggw5a5u3x34lm0a8tqdq4dac8g6t0deskcgrdv4kk7cqzpgxqyz5vqsp5kp28ygpw05ydgmptd2huvcx3k0e06q4knxdh6ef73jmfgcxh827q9qyyssqyp5a4d5j7he3l72dh8hmejgx6czlhh04kyetr45n8hvemewqv2tzdyr2gy389j0fpluee2348ldtl973wel4j9zh6kllhu3hjv9jx2sprerdfx"
```

---

### decodePayReq()

DecodePayReq takes an encoded payment request string and attempts to decode it, returning a full description of the conditions encoded within the payment request. https://api.lightning.community/#decodepayreq

Required params: payReq

```js
let payReq =
  'lnbcrt12u1psug8jnpp5xfhxfuek7vpnq9yeauxlwgx53nssrknam4ggw5a5u3x34lm0a8tqdq4dac8g6t0deskcgrdv4kk7cqzpgxqyz5vqsp5kp28ygpw05ydgmptd2huvcx3k0e06q4knxdh6ef73jmfgcxh827q9qyyssqyp5a4d5j7he3l72dh8hmejgx6czlhh04kyetr45n8hvemewqv2tzdyr2gy389j0fpluee2348ldtl973wel4j9zh6kllhu3hjv9jx2sprerdfx';

const response = await lightning.decodePayReq(payReq);
// {"destination":"02dcac4b73e84ea09092a985ea4b78de73d619ce218b9fb1b22070c48e9f64f040","paymentHash":"326e64f336f303301499ef0df720d48ce101da7ddd508753b4e44d1aff6fe9d6","numSatoshis":"1200","timestamp":"1640242771","expiry":"86400","description":"optional memo","cltvExpiry":"40","paymentAddr":"sFRyIC59CNRsK2qvxmDRs/L9AraZm31lPoy2lGDXOrw=","numMsat":"1200000","features":{"9":{"name":"tlv-onion","isKnown":true},"14":{"name":"payment-addr","isRequired":true,"isKnown":true},"17":{"name":"multi-path-payments","isKnown":true}}}
```

---

### sendPayment()

Attempts to route a payment described by the passed PaymentRequest to the final destination. https://api.lightning.community/#sendpayment

Required params: payReq

```js
let payReq =
  'lnbcrt10u1psuggp0pp582mg4m4vcxes3fqn47z43c7vkfccllzx2cqkmfrdt4j9h0p6z0zqdqqcqzpgsp586uypxhms0l3djs2t9y9l60ludz06aw928wsv7d6musyqayhh88s9qyyssq98uu6e42suz03fph2zumn3c76yfzdjmh5t42ptmejy373w92yp7z56m9vn3lstrt5vq6qyt4saydwf03v4mp22vxxfcmj3t4k4g2dvqqje69x3';

const response = await lightning.sendPayment(payReq);

// {"paymentPreimage":"HDacwSLNvqiECtOag1BlXiyEFsO+YFA08DAgI7J3STc=","paymentRoute":{"totalTimeLock":286,"totalAmt":"1000","hops":[{"chanId":"255086697709568","chanCapacity":"50000","amtToForward":"1000","expiry":286,"amtToForwardMsat":"1000000","pubKey":"025c8325a8ef931d1b29be82dd6c9a57047cb5f9d202f1a8e9812e4f3892938f7b","tlvPayload":true,"mppRecord":{"totalAmtMsat":"1000000","paymentAddr":"PrhAmvuD/xbKCllIX+n/40T9dcVR3QZ5ut8gQHSXuc8="}}],"totalAmtMsat":"1000000"},"paymentHash":"OraK7qzBswikE6+FWOPMsnGP/EZWAW2kbV1kW7w6E8Q="}
```

### Thanks to the following for inspiring this project

This module wouldn't be possible without the hard work already done by many other projects out there which we referred to for inspiration and to solve common challenges. Some of the key projects we would like to mention and thank are:

https://github.com/alexbosworth/lightning

https://github.com/coreyphillips/react-native-lightning

https://github.com/hsjoberg/blixt-wallet

https://github.com/alexbosworth/ln-service

https://github.com/lightningnetwork/lnd/tree/master/mobile

https://github.com/lndroid/lndroid-daemon

