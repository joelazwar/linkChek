const { validateUrl } = require("./validateUrl.js");
const { output } = require("./output.js");
const { ignoreUrl } = require("./ignoreUrl.js");
const { httpsOption } = require("./httpsOption.js");

module.exports.checkLinks = function (urls, options, id = null) {
	urls = urls.match(
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,25}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
	); //compile all links, using regex, into an Array

	urls = Array.from(new Set(urls)); //Eliminating duplicate links

	if (options.ignore) {
		urls = ignoreUrl(urls, options.ignore);
	}

	if (options.option) {
		urls = httpsOption(urls);
	}

	const promises = urls.map(validateUrl, options.timeout);

	Promise.all(promises)
		.then((res) => output(res, options, id))
		.catch((err) => console.error(err));
};
