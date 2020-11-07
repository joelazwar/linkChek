const chalk = require("chalk");
const fetch = require("node-fetch");
const fs = require("fs");

export function htmlVerify(urls, options) {

    urls = urls.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,25}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g); //compile all links, using regex, into an Array
  
    urls = Array.from(new Set(urls)); //Eliminating duplicate links
  
    if (options.ignore) {  //ignore option by Jossie
  
      let data;
      try {
        data = fs.readFileSync(options.ignore, "utf8");
      } catch (err) {
        throw new Error("!!Error Reading Ignore File!!");
      }
  
      let ignoreUrls = data.match(/^((?!#).)*$/gm);
  
      if (ignoreUrls != null) {
        ignoreUrls = ignoreUrls.filter((url) => url != "");
  
        ignoreUrls.forEach((ignoreUrl) => {
          if (!ignoreUrl.startsWith("https://") && !ignoreUrl.startsWith("http://"))
            throw new Error("Invalid Ignore File");
  
          urls = urls.filter((url) => !url.startsWith(ignoreUrl));
        });
      }
    }
  
    let userTime = 0;

    if (options.timeout) {
      userTime = options.timeout;
    }
  
    urls.forEach((url) => {    //iterates through url Array
      const isHttps = options.option;
      if (isHttps && !url.startsWith("https")) {
        url = url.replace(/^http/, "https");
      }
    });
  
    async function checkUrl(url) {
      try {
        const res = await fetch(url, { method: "HEAD", timeout: userTime }); //sends HTTP head request to omit receiving the data from body
        return { url, status: res.status };
      } catch (err) {
        if (err.type == "request-timeout") {
          return { url, status: -2 };
        } else {
          return { url, status: -1 };
        }
      }
    }
  
    function linkOutput(res) {

      let count = 1;
  
      let resJson = [];
  
      res.forEach((res) => {
        if (res.status == 200 && (options.all || options.good) && !options.bad) {
          console.log(count++ + ". " + chalk.green("[GOOD] — " + res.url)); //good url output
          resJson.push(res);
        } else if (res.status == 400 || (res.status == 404 && (options.all || options.bad) && !options.good)) {
          console.log(count++ + ". " + chalk.red("[BAD] — " + res.url)); //bad url output
          resJson.push(res);
        } else if (res.status == -2 && !options.good && !options.bad) {
          console.log(count++ + ". " + chalk.grey("[TIMEOUT] — " + res.url)); //unknown url output
          resJson.push(res);
        } else if (!options.good && !options.bad) {
          console.log(count++ + ". " + chalk.grey("[UNKNOWN] — " + res.url)); //unknown url output
          resJson.push(res);
        }
      });
  
      if (options.json) console.log(resJson);
    }
  
    const promises = urls.map(checkUrl);
  
     Promise.all(promises)
      .then((res) => linkOutput(res))
      .catch((err) => console.error(err));
  }