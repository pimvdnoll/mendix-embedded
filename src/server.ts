import * as express from "express";
import * as bodyParser from "body-parser";
import { settings } from "./settings";
import * as chalk from 'chalk';
import { http } from "./serverside/http";
import { rewriter, rewriteType } from "./rewriter";
import { createProxyMiddleware } from "http-proxy-middleware";

const logo: string = 
` 
 -+ooooooooooooooooooooooooo+: 
/ssssssssssssssssssssssssssssso
ossssssssssssssssssssssssssssss 
ossssssssssssssssssssssssssssss
osssoooooooossoooos+++sso++osss 
osss   .-   .-.   --  -/   +sss 
osss   /s+   +s:   s:     +ssss
osss   /s+   os/   ss.   /sssss
osss   /s+   os/   s:     +ssss
osss   /s+   os/   -  -/   +sss
osss+++oss+++sso++++++sso++osss
ossssssssssssssssssssssssssssss
ossssssssssssssssssssssssssssss
/ssssssssssssssssssssssssssssso
 -+ooooooooooooooooooooooooo+:
 
 `;

export class server
{
  private app: any;
  private config: settings;
  private proxy: any;
  private wsproxy: any;
  private widgetproxy: any;
  private ssoproxy: any;

  constructor( config: settings)
  {
    this.config = config;

  }

  onProxyReq(proxyReq: any, req: any, res: any) 
  {
    if (req.path === "/xas/")
    {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(JSON.stringify(req.body)));
      proxyReq.write(JSON.stringify(req.body));
    }    
  }

  onProxyError(err: any, req: any, res: any) {

    console.log("Error in proxy " + err);
  }

  startProxies(targetPath:string, target: string, logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent')
  {
    console.log(chalk.yellow(`starting proxies: path: ${targetPath} target: ${target}`));
    let rrp = `pathRewrite: {'^${this.config.settings.proxy.path}': ''}`;
    this.proxy = createProxyMiddleware(targetPath, 
      { 
        target: target, 
        changeOrigin: true, 
        onError: this.onProxyError, 
        onProxyReq: this.onProxyReq, 
        pathRewrite: function (path, req, replacer=targetPath) { return path.replace(replacer, ''); },
        logLevel: logLevel
      });
    this.widgetproxy = createProxyMiddleware('/widgets', 
    { 
        target: target, 
        changeOrigin: true, 
        onError: this.onProxyError, 
        logLevel: logLevel 
    });
    this.ssoproxy = createProxyMiddleware('/sso', 
    { 
        target: target, 
        changeOrigin: true, 
        onError: this.onProxyError, 
        logLevel: logLevel 
    });
    this.wsproxy = createProxyMiddleware(`${targetPath}/reload`, { target: `${target}/reload/`, changeOrigin: true, ws: true, onError: this.onProxyError, logLevel: logLevel});
    this.app.use(this.proxy); // start the proxy
    this.app.use(this.wsproxy); // start the proxy
    this.app.use(this.widgetproxy); // start the proxy
    this.app.use(this.ssoproxy); // start the proxy
  }

  serve()
  {
    this.app = express();
    this.app.set('view engine', 'ejs');
    this.app.use(express.static('public'));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    this.startProxies(this.config.settings.proxy.path, this.config.settings.mxtarget, "debug" );
    // handle reload request for clientside
    this.app.get( "/clientside", ( req: any, res: any ) => 
    {
      console.log(chalk.yellowBright("incoming for clientside: " + this.config.settings.mxtarget));
      res.render('clientside/index', {target:this.config.settings.mxtarget});
    });

    // handle reload request for server
    this.app.get( "/serverside", ( req: any, res: any ) => 
    {
      let localpath = `${this.config.settings.hostpath}:${this.config.settings.hostport}${this.config.settings.proxy.path}`;
      let querystring: string = http.stringyfyQuery(req.query);
      console.log(chalk.yellowBright(`incoming for serverside : ${localpath}?${querystring}`));
      
      http.get(`${localpath}?${querystring}`).then((html) =>
      {
        let host = `${this.config.settings.hostpath}:${this.config.settings.hostport}`;
        let rewittenhtml = rewriter.rewrite(html, rewriteType.content, this.config.settings.proxy.path, host);
        let style = rewriter.rewrite(html, rewriteType.style, this.config.settings.proxy.path, host);
        let script = rewriter.rewrite(html, rewriteType.script, this.config.settings.proxy.path, host);
        res.render('serverside/index', { style: style, content: rewittenhtml, script: script });
      }).catch((error) => {
        console.error(chalk.bgRed("cannot reach proxy"));
        res.render('serverside/index', { style: "", content: `<div class='alert alert-danger'>Proxy is down would expect a running Mendix app at: <a href="${this.config.settings.mxtarget}">${this.config.settings.mxtarget}</a> </div>`, script: "" });
      });
    });

    
    this.app.get('/',  (req: any, res: any) =>
    {
      res.render('index');
    })
    console.log(chalk.blueBright(logo));

    // listen to incoming requests
    let server = this.app.listen(this.config.settings.hostport, () =>
    {
      console.log(chalk.blueBright(`Started on PORT ${this.config.settings.hostport} `));
    });
  }

  stop()
  {
    this.app.close();
  }
}



