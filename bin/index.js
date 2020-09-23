#!/usr/bin/env node

const chalk = require("chalk");
const yargs = require("yargs");
const fetch = require("node-fetch");
const fs = require("fs");

const regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,25}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g


const options = yargs
.scriptName("linkChek")
.usage("Usage: $0 -f <html-link>")
.option("f", {
    alias: "file", 
    describe: "Your HTML file", 
    type: "string", 
    demandOption: true 
})
.argv;

function linkCheck(link) {

    
    let fileData = fs.readFile(link, 'utf8', data = (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let urls = data.match(regEx); //compile all links, using regex, into an Array

        urls = Array.from(new Set(urls)); //Eliminating duplicate links

        htmlVerify(urls);
    })

}

function htmlVerify(urls){
    let count = 0;

    urls.forEach(url=>{
        fetch(url, {method: 'HEAD'})
        .then(res=>{

            count++;

            process.stdout.write(count + ". ");

            if (res.status == 200){
                console.log(chalk.green("[GOOD] — " + url));
            } else if(res.status == 400 || res.status == 404){
                console.log(chalk.red("[BAD] — " + url));
            } else{
                console.log(chalk.grey("[UNKNOWN] — " + url));
            }
        })
        .catch(()=>{
            count ++;
            console.log(count + ". " + chalk.grey("[UNKNOWN] — " + url));
        });
    })
}

linkCheck(options.file);
