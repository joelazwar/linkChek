const yargs = require("yargs");
const { version } = require("../package.json");
const { linkCheck } = require("./linkCheck.js");

const options = yargs
	.scriptName("linkChek")
	.usage("Usage: $0 -l <html-link/html-file>")
	.option("l", {
		alias: "link",
		describe: "Your HTML file/link",
		type: "string",
		demandOption: true,
	})
	.option("o", {
		alias: "option",
		describe: "All urls will be changed to https",
		type: "boolean",
	})
	.option("t", {
		alias: "timeout",
		describe: "Provide ms for waiting for a request",
		type: "number",
	})
	.option("j", {
		alias: "json",
		describe: "Provide JSON output",
		type: "boolean",
	})
	.option("i", {
		alias: "ignore",
		describe: "Your ignore URLs file",
		type: "string",
	})
	.option("all", {
		describe: "Get all results (default)",
		type: "boolean",
		default: true,
	})
	.option("good", {
		describe: "Get only good results",
		type: "boolean",
	})
	.option("bad", {
		describe: "Get only bad results",
		type: "boolean",
	})
	.option("telescope", {
		describe: "Check links from telescope posts",
		type: "boolean",
	})
	.alias("h", "help")
	.help("help", "Show usage information & exit")
	.alias("v", "version")
	.version("version", "Show version number & exit", "linkChek " + version).argv;

module.exports.main = function () {
	if (options.good && options.bad)
		return console.error("ERROR! Flags --good and --bad cannot be used at the same time");

	linkCheck(options.link, options);
};
