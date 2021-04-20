export declare enum rewriteType {
    script = 0,
    meta = 1,
    content = 2,
    style = 3
}
export declare class rewriter {
    constructor();
    static rewrite(html: string, style: rewriteType, proxypath: string, rooturl: string): string;
}
