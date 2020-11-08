const yargs = require("yargs");
const fetch = require("node-fetch");
const fs = require("fs");
const { version } = require("../package.json");
const { htmlVerify } = require("./htmlVerify.js");

const options = yargs
  .scriptName("linkChek")
  .usage("Usage: $0 -l <html-link/html-file>")
  .option("l", {
    alias: "link",
    describe: "Your HTML file/link",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "option",
    describe: "All urls will be changed to https",
    type: "boolean",
  })
  .option("t", {
    alias: "timeout",
    describe: "Provide ms for waiting for a request",
    type: "number",
  })
  .option("j", {
    alias: "json",
    describe: "Provide JSON output",
    type: "boolean",
  })
  .option("i", {
    alias: "ignore",
    describe: "Your ignore URLs file",
    type: "string",
  })
  .option("all", {
    describe: "Get all results (default)",
    type: "boolean",
    default: true,
  })
  .option("good", {
    describe: "Get only good results",
    type: "boolean",
  })
  .option("bad", {
    describe: "Get only bad results",
    type: "boolean",
  })
  .option("telescope", {
    describe: "Check links from telescope posts",
    type: "boolean",
  })
  .alias("h", "help")
  .help("help", "Show usage information & exit")
  .alias("v", "version")
  .version("version", "Show version number & exit", "linkChek " + version).argv;

function linkCheck(link) {
  //checks link/file for data in utf8/text

  if (options.telescope) {
    fetch("http://localhost:3000/posts?per_page=10")
      .then((res) => res.json())
      .then((json) => {
        for (var post of json) {
          fetch(`http://localhost:3000/posts/${post.id}`)
            .then((response) => response.text())
            .then((data) => {
              htmlVerify(data, options, post.id);
            })
            .catch((err) => console.log(err));
        }
      });
  } else if (
    link.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,25}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    )
  ) {
    //checks if the given string is a URL

    fetch(link)
      .then((response) => response.text())
      .then((data) => htmlVerify(data, options))
      .catch((err) => console.log(err));
  } else {
    fs.readFile(link, "utf8", (err, data) => {
      //if not it is assumed to be a file

      if (err) {
        console.error(err);
        return;
      }

      htmlVerify(data, options);
    });
  }
}

export function linkChecker() {
  if (options.good && options.bad)
    return console.error(
      "ERROR! Flags --good and --bad cannot be used at the same time"
    );

  linkCheck(options.link);
}
