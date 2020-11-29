module.exports.httpsOption = function (urls) {
	return urls.map((url) => {
		if (!url.startsWith("https")) {
			return url.replace(/^http/, "https");
		} else {
			return url;
		}
	});
};
