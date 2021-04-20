import * as urllib from "urllib";
import * as chalk from 'chalk';

export class http
{
    static stringyfyQuery(query: string[][]): string
    {
        console.log(chalk.redBright(JSON.stringify( query )));

        return new URLSearchParams(query).toString();
    }

    static async get(url: string): Promise<string> 
    {
        return urllib.request(url).then(function (result) {
            // result: {data: buffer, res: response object}
            //console.log('status: %s, body size: %d, headers: %j', result.res.statusCode, result.data.length, result.res.headers);
            console.log(chalk.redBright(`Fetching content from: ${url}`));
            return new Promise<string>((resolve) => {
                resolve(result.data);
            });
        });
    }
}