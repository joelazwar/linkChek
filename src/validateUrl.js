const fetch = require("node-fetch");

module.exports.validateUrl = async function (url) {
	try {
		const res = await fetch(url, { method: "HEAD", timeout: Number(this) }); //sends HTTP head request to omit receiving the data from body
		return { url, status: res.status };
	} catch (err) {
		if (err.type == "request-timeout") {
			return { url, status: -2 };
		} else {
			return { url, status: -1 };
		}
	}
};
