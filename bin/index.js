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
    .option("all", {
        describe: 'Get all results (default)',
        type: 'boolean',
        default: true
    })
    .option("good", {
        describe: 'Get only good results',
        type: 'boolean'
    })
    .option("bad", {
        describe: 'Get only bad results',
        type: 'boolean'
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

function htmlVerify(urls) {

    urls = urls.match(regEx); //compile all links, using regex, into an Array

    urls = Array.from(new Set(urls)); //Eliminating duplicate links

    if (options.timeout){
        userTime = options.timeout
    }
    else {
        userTime = 0;
    }

    urls.forEach(url => {           //iterates through url Array
        const isHttps = options.option;
        if (isHttps && !url.startsWith('https')) {
            url = url.replace(/^http/, "https");
        }
    });
    
    async function checkUrl(url) {

        try {
            const res = await fetch(url, { method: 'HEAD', timeout: userTime });     //sends HTTP head request to omit receiving the data from body
            return {url, status: res.status} ;
        } catch (err) {
            if (err.type == 'request-timeout') {
                return { url, status: -2 };
            }
            else {
                return { url, status: -1 }
            }
        }
    }

    function linkOutput(res) {

        let count = 1;

        res.forEach(res => {
            
            if (res.status == 200 && (options.all || options.good) && !options.bad) {
                console.log(count++ + '. ' + chalk.green("[GOOD] — " + res.url));            //good url output
            } else if (res.status == 400 || res.status == 404 && (options.all || options.bad) && !options.good) {
                console.log(count++ + '. ' + chalk.red("[BAD] — " + res.url));               //bad url output
            } else if(res.status == -2 && !options.good && !options.bad){
                console.log(count++ + '. ' + chalk.grey("[TIMEOUT] — " + res.url));          //unknown url output
            } else if(!options.good && !options.bad) {
                console.log(count++ + '. ' + chalk.grey("[UNKNOWN] — " + res.url));          //unknown url output
            }
        })
    };

    const promises = urls.map(checkUrl);

    Promise.all(promises)
            .then(res => linkOutput(res))
            .catch(err => console.error(err));


    
}

if (options.good && options.bad)
    return console.error("ERROR! Flags --good and --bad cannot be used at the same time");

linkCheck(options.link);

