const fs = require("fs");

module.exports.ignoreUrl = function (urls, ignore) {
	//ignore option by Jossie
	let data;
	try {
		data = fs.readFileSync(ignore, "utf8");
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

	return urls;
};
