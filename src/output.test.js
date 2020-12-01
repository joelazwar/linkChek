const { output } = require("./output.js");
const chalk = require("chalk");

describe("Ignore File Option Tests", () => {
	const linkResults = [
		{ url: "https://www.example.com/", status: 200 },
		{ url: "https://www.google.com/", status: 404 },
		{ url: "https://www.youtube.com/", status: -2 },
		{ url: "https://www.senecacollege.com/", status: -1 },
	];

	test("Default Results", () => {
		const outputResult = [
			["1. " + chalk.green("[GOOD] — https://www.example.com/")],
			["2. " + chalk.red("[BAD] — https://www.google.com/")],
			["3. " + chalk.grey("[TIMEOUT] — https://www.youtube.com/")],
			["4. " + chalk.grey("[UNKNOWN] — https://www.senecacollege.com/")],
		];

		console.log = jest.fn();

		output(linkResults, { all: true, good: false, bad: false });

		expect(console.log.mock.calls).toEqual(outputResult);
	});

	test("Good option is true", () => {
		const outputResult = "1. " + chalk.green("[GOOD] — https://www.example.com/");

		console.log = jest.fn();

		output(linkResults, { all: true, good: true, bad: false });

		expect(console.log).toHaveBeenCalledWith(outputResult);
	});

	test("Bad option is true", () => {
		const outputResult = "1. " + chalk.red("[BAD] — https://www.google.com/");

		console.log = jest.fn();

		output(linkResults, { all: true, good: false, bad: true });

		expect(console.log).toHaveBeenCalledWith(outputResult);
	});
});
