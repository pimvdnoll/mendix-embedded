import { settings } from "./settings";
import { server } from "./server";
import * as chalk from 'chalk';
import { readdir }  from 'fs';


let config: settings = new settings();

const tt = './';
const fs = require('fs');

fs.readdir(tt, (err: any, files: any) => {
  for (let file of files)
  {
    console.log(file);
  }
});

config.load('./config.yaml');
console.log(chalk.yellow(config.settings.webfoldername));


let serv: server = new server( config);
serv.serve();
