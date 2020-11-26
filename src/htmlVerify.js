const { checkUrl } = require("./checkUrl.js");
const { output } = require("./output.js");
const { ignoreUrl } = require("./ignoreUrl.js");

module.exports.htmlVerify = function (urls, options, id = null) {
	urls = urls.match(
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,25}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
	); //compile all links, using regex, into an Array

	urls = Array.from(new Set(urls)); //Eliminating duplicate links

	if (options.ignore) {
		urls = ignoreUrl(urls, options.ignore);
	}

	let userTime = 0;

	if (options.timeout) {
		userTime = options.timeout;
	}

	urls.forEach((url) => {
		//iterates through url Array
		const isHttps = options.option;
		if (isHttps && !url.startsWith("https")) {
			url = url.replace(/^http/, "https");
		}
	});

	const promises = checkUrl(urls, userTime);

	Promise.all(promises)
		.then((res) => output(res, options, id))
		.catch((err) => console.error(err));
};
