import { parse } from 'node-html-parser';

export enum rewriteType {
    script,
    meta,
    content,
    style
}

export class rewriter
{
    
    constructor()
    {
    }

    static rewrite(html: string, style: rewriteType, proxypath: string, rooturl: string): string
    {
        const options = {
            lowerCaseTagName: true,  // convert tag name to lower case (hurt performance heavily)
            script: true,            // retrieve content in <script> (hurt performance slightly)
            style: true,             // retrieve content in <style> (hurt performance slightly)
            pre: true,               // retrieve content in <pre> (hurt performance slightly)
            comment: true            // retrieve comments (hurt performance slightly)
          }
        let root = parse(html, options).removeWhitespace();
        switch (style)
        {
            case rewriteType.content:
            {
                //return "nothing";
                let content = root.querySelector('#content').toString();
                let newcontent = content.replace('/login',`${proxypath}/login`);
                return newcontent;
            }
            case rewriteType.script:
            {
                let html = root.querySelectorAll('script').toString();
                let newhtml = html.replace('src="',`src=${proxypath}/`);
                newhtml = newhtml.replace('baseUrl: "',`appbase: "${rooturl}/${proxypath.substr(1)}/" ,baseUrl: "${rooturl}/${proxypath.substr(1)}/`);
                newhtml = newhtml.replace('/login',`${proxypath}/login`);
                newhtml = newhtml.replace('/sso',`${proxypath}/sso`);
                newhtml = newhtml.split('</script>,').join('</script>');
                return newhtml;
            }
            case rewriteType.style:
            {
                let html = root.querySelectorAll('link').toString();
                let newhtml = html.replace('href="',`href="${proxypath}/`)
                return newhtml;
            }
            case rewriteType.meta:
            {
                return root.querySelectorAll('meta').toString();
            }
        }
    }
}