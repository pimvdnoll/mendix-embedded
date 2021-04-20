import yaml = require('js-yaml');
import * as fs from "fs";

export class settings
{
    public settings: any = null;

    load(filename: string): any
    {
        try
        {
            console.log(__filename);
            console.log(__dirname);
            console.log(filename);
            this.settings = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
        }
        catch (e)
        { 
            console.log(e);
            return null;
        }
    }

    save(filename: string): boolean
    {
        yaml.safeDump(this.settings);
        return true;
    }
}
