#!/usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs");
const fetch = require("node-fetch");
const fs = require("fs");
const { version } = require("../package.json");

const regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,25}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

const options = yargs
    .scriptName("linkChek")
    .usage("Usage: $0 -l <html-link/html-file>")
    .option("l", {
        alias: "link",
        describe: "Your HTML file/link",
        type: "string",
        demandOption: true
    })
    .option("o", {
        alias: 'option',
        describe: 'All urls will be changed to https',
        type: 'boolean'
    })
    .option("t", {
        alias: 'timeout',
        describe: 'Provide ms for waiting for a request',
        type: 'number'
    })
    .alias('h', 'help')
    .help('help', 'Show usage information & exit')
    .alias('v', 'version')
    .version('version', 'Show version number & exit', "linkChek " + version)
    .argv;

function linkCheck(link) {      //checks link/file for data in utf8/text

    if (link.match(regEx)) {        //checks if the given string is a URL
        fetch(link)
            .then(response => response.text())
            .then(data => htmlVerify(data))
            .catch(err => console.log(err));
    } else {

        fs.readFile(link, 'utf8', data = (err, data) => {     //if not it is assumed to be a file
            if (err) {
                console.error(err);
                return;
            }

            htmlVerify(data);

        })
    }

}

function withTimeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error("timeout error"))
        }, ms)
        promise.then(resolve, reject)
    })
}

function htmlVerify(urls) {

    urls = urls.match(regEx); //compile all links, using regex, into an Array

    urls = Array.from(new Set(urls)); //Eliminating duplicate links

    let count = 0;

    urls.forEach(url => {           //iterates through url Array
        const isHttps = options.option;
        if (isHttps && !url.startsWith('https')) {
            url = url.replace(/^http/, "https");
        }
        const timeout = options.timeout || 120000;
        withTimeout(timeout, fetch(url, { method: 'HEAD', }))      //sends HTTP head request to omit receiving the data from body
            .then(res => {
                count++; //increments url index for presentation
                process.stdout.write(count + ". ");

                if (res.status == 200) {
                    console.log(chalk.green("[GOOD] — " + url));            //good url output
                } else if (res.status == 400 || res.status == 404) {
                    console.log(chalk.red("[BAD] — " + url));               //bad url output
                } else {
                    console.log(chalk.grey("[UNKNOWN] — " + url));          //unknown url output
                }
            })
            .catch((e) => {
                count++;
                if (e.message === 'timeout error') {
                    console.log(count + ". " + chalk.grey("[TIMEOUT] — " + url));
                } else {
                    console.log(count + ". " + chalk.grey("[UNKNOWN] — " + url));   //if fetch throws an err regarding the link, it results as unknown
                }
            });
    })
}

linkCheck(options.link);
