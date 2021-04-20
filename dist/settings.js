"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const yaml = require("js-yaml");
const fs = require("fs");
class settings {
    constructor() {
        this.settings = null;
    }
    load(filename) {
        try {
            console.log(__filename);
            console.log(__dirname);
            console.log(filename);
            this.settings = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    save(filename) {
        yaml.safeDump(this.settings);
        return true;
    }
}
exports.settings = settings;
//# sourceMappingURL=settings.js.map