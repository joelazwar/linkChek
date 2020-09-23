#!/usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs");
const fetch = require("node-fetch");
const fs = require("fs");

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
    .argv;

function linkCheck(link) {

    if (link.match(regEx)) {
        fetch(options.file)
            .then(response => response.text())
            .then(data => htmlVerify(data))
            .catch(err=> console.log(err));
    } else {

        fs.readFile(link, 'utf8', data = (err, data) => {
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

    let count = 0;

    urls.forEach(url => {
        fetch(url, { method: 'HEAD' })
            .then(res => {

                count++;

                process.stdout.write(count + ". ");

                if (res.status == 200) {
                    console.log(chalk.green("[GOOD] — " + url));
                } else if (res.status == 400 || res.status == 404) {
                    console.log(chalk.red("[BAD] — " + url));
                } else {
                    console.log(chalk.grey("[UNKNOWN] — " + url));
                }
            })
            .catch(() => {
                count++;
                console.log(count + ". " + chalk.grey("[UNKNOWN] — " + url));
            });
    })
}


linkCheck(options.link);
