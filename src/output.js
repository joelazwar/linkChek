const chalk = require("chalk");

module.exports.output = function (res, options, id = null) {
	if (id) console.log("\nPost " + id);

	let count = 1;

	let resJson = [];

	res.forEach((res) => {
		if (res.status == 200 && (options.all || options.good) && !options.bad) {
			console.log(count++ + ". " + chalk.green("[GOOD] — " + res.url)); //good url output
			resJson.push(res);
		} else if (
			res.status == 400 ||
			(res.status == 404 && (options.all || options.bad) && !options.good)
		) {
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
};
