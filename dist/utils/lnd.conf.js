export const defaultLndConfig = `
[Application Options]
debuglevel=info
no-macaroons=1
maxbackoff=2s
nolisten=1
norest=1
sync-freelist=1
accept-keysend=1

[Routing]
routing.assumechanvalid=1

[Bitcoin]
bitcoin.active=1
bitcoin.regtest=1
bitcoin.testnet=0
bitcoin.node=bitcoind

[Bitcoind]
bitcoind.rpchost=192.168.23.192:18443
bitcoind.rpcuser=polaruser
bitcoind.rpcpass=polarpass
bitcoind.zmqpubrawblock=192.168.23.192:28334
bitcoind.zmqpubrawtx=192.168.23.192:29335

[Neutrino]
neutrino.addpeer=faucet.lightning.community
neutrino.feeurl=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json

[autopilot]
autopilot.active=0
autopilot.private=0
autopilot.minconfs=0
autopilot.conftarget=30
autopilot.allocation=1.0
autopilot.heuristic=externalscore:0.95
autopilot.heuristic=preferential:0.05`;
