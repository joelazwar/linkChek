const fetch = require("node-fetch");
const fs = require("fs");
const { checkLinks } = require("./checkLinks.js");

module.exports.argIdentify = function (link, options) {
	//checks link/file for data in utf8/text

	if (options.telescope) {
		fetch("http://telescope.cdot.systems/posts?per_page=10")
			.then((res) => res.json())
			.then(async (json) => {
				for (var post of json) {
					let res = await fetch(`http://telescope.cdot.systems/posts/${post.id}`)
						.then((response) => response.text())
						.catch((err) => console.log(err));

					checkLinks(res, options, post.id);
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
			.then((data) => checkLinks(data, options))
			.catch((err) => console.log(err));
	} else {
		try {
			const data = fs.readFileSync(link, "utf8");
			checkLinks(data, options);
		} catch (err) {
			throw new Error("File not found");
		}
	}
};
