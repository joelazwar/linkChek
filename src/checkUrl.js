const fetch = require("node-fetch");

module.exports.checkUrl = function (urls, userTime = 0) {
	return urls.map(async function (url) {
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
	});
};
