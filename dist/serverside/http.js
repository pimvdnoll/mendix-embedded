"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const urllib = require("urllib");
const chalk = require("chalk");
class http {
    static stringyfyQuery(query) {
        console.log(chalk.redBright(JSON.stringify(query)));
        return new URLSearchParams(query).toString();
    }
    static get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return urllib.request(url).then(function (result) {
                // result: {data: buffer, res: response object}
                //console.log('status: %s, body size: %d, headers: %j', result.res.statusCode, result.data.length, result.res.headers);
                console.log(chalk.redBright(`Fetching content from: ${url}`));
                return new Promise((resolve) => {
                    resolve(result.data);
                });
            });
        });
    }
}
exports.http = http;
//# sourceMappingURL=http.js.map