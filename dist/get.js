"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const server_1 = require("./server");
const chalk = require("chalk");
let config = new settings_1.settings();
const tt = './';
const fs = require('fs');
fs.readdir(tt, (err, files) => {
    for (let file of files) {
        console.log(file);
    }
});
config.load('./config.yaml');
console.log(chalk.yellow(config.settings.webfoldername));
let serv = new server_1.server(config);
serv.serve();
//# sourceMappingURL=get.js.map