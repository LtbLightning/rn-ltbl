## LNCLI, BITCOIN-CLI, LND Commands reference

### Important Urls

https://coinfaucet.eu/en/btc-testnet/
https://testnet-faucet.mempool.co/
https://www.blockchain.com/btc-testnet/address/tb1q4sju68x2aczy9mmdm36c7d2smuryuj4ss7dlr7

### Send bitcoin to address

`bitcoin-cli sendtoaddress "bcrt1qu0vkk6l8d5retsmkmzy6ejvtt6c3q7exgkxgf2" 2`

### get new wallet address

`bitcoin-cli getnewaddress`

### List transactions

`bitcoin-cli listtransactions`

### List channels

`lncli listchannels`

### Open channel

`lncli openchannel --node_key=025ea5e4e1bb57794fb8a0d6a5ee1df6e3c57c713a33736dd85e6f7aec890ccdf4 --local_amt=20000`

### Add invoice

`lncli addinvoice --amt 1000`

### Send payment to payment_request

`lncli sendpayment --pay_req "lnbcrt10u1pseed0ppp5urscmsx2zu3pgwmm8cc4xsfakjl9843jfwcp5qlr72eah3hre2vsdq5w3jhxapqd9h8vmmfvdjscqzpgsp5p8r7ag5lgv0eu54r44akjzfrq0s04t4klu3zecrkf092qkur738s9qy9qsq59a44wup0d860vkxkamwvar6jg9gakm30pvjft3uz9ck480rukrpu60njzsz56z0nlgmm7h6aydpz3la96kx927e683y5me9u3g7xuqqkkura4"`

### Lookup for the invoice

`lncli lookupinvoice --rhash=85b8c7add27420329997f4d02afdb665d791940737e58e735afa15ce39371239`
