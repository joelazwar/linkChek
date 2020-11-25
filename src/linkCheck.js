const fetch = require("node-fetch");
const fs = require("fs");
const { htmlVerify } = require("./htmlVerify.js");

module.exports.linkCheck = function (link, options) {
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
};
