export interface Response {
    error: boolean;
    data: any;
}
export interface RnMylndType {
    start: (config: string) => Promise<Response>;
    genSeed: () => [];
    createWallet: (password: string, seed: []) => string;
    walletExists: (network: string) => boolean;
    unlock: (password: string) => string;
    sendCommand: (method: string, req: string) => any;
    addListener: (event: string, callback: () => {}) => any;
    sendStreamWrite: (streamId: string, request: any) => any;
    sendStreamCommand: (method: string, streamId: any, req: any) => any;
}
