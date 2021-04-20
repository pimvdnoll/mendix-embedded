import { settings } from "./settings";
export declare class server {
    private app;
    private config;
    private proxy;
    private wsproxy;
    private widgetproxy;
    private ssoproxy;
    constructor(config: settings);
    onProxyReq(proxyReq: any, req: any, res: any): void;
    onProxyError(err: any, req: any, res: any): void;
    startProxies(targetPath: string, target: string, logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent'): void;
    serve(): void;
    stop(): void;
}
