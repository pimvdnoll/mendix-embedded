"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriter = exports.rewriteType = void 0;
const node_html_parser_1 = require("node-html-parser");
var rewriteType;
(function (rewriteType) {
    rewriteType[rewriteType["script"] = 0] = "script";
    rewriteType[rewriteType["meta"] = 1] = "meta";
    rewriteType[rewriteType["content"] = 2] = "content";
    rewriteType[rewriteType["style"] = 3] = "style";
})(rewriteType = exports.rewriteType || (exports.rewriteType = {}));
class rewriter {
    constructor() {
    }
    static rewrite(html, style, proxypath, rooturl) {
        const options = {
            lowerCaseTagName: true,
            script: true,
            style: true,
            pre: true,
            comment: true // retrieve comments (hurt performance slightly)
        };
        let root = node_html_parser_1.parse(html, options).removeWhitespace();
        switch (style) {
            case rewriteType.content:
                {
                    //return "nothing";
                    let content = root.querySelector('#content').toString();
                    let newcontent = content.replace('/login', `${proxypath}/login`);
                    return newcontent;
                }
            case rewriteType.script:
                {
                    let html = root.querySelectorAll('script').toString();
                    let newhtml = html.replace('src="', `src=${proxypath}/`);
                    newhtml = newhtml.replace('baseUrl: "', `appbase: "${rooturl}/${proxypath.substr(1)}/" ,baseUrl: "${rooturl}/${proxypath.substr(1)}/`);
                    newhtml = newhtml.replace('/login', `${proxypath}/login`);
                    newhtml = newhtml.replace('/sso', `${proxypath}/sso`);
                    newhtml = newhtml.split('</script>,').join('</script>');
                    return newhtml;
                }
            case rewriteType.style:
                {
                    let html = root.querySelectorAll('link').toString();
                    let newhtml = html.replace('href="', `href="${proxypath}/`);
                    return newhtml;
                }
            case rewriteType.meta:
                {
                    return root.querySelectorAll('meta').toString();
                }
        }
    }
}
exports.rewriter = rewriter;
//# sourceMappingURL=rewriter.js.map