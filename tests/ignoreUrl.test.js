jest.mock("fs");

const fs = require("fs");
const { ignoreUrl } = require("../src/ignoreUrl.js");

describe("Ignore File Option Tests", () => {
	const urls = [
		"https://www.example.com/",
		"https://www.google.com/",
		"https://www.senecacollege.com/",
	];

	const MOCK_FILE_INFO = [
		{ name: "googleIgnore", data: "https://www.google.com" },
		{ name: "emptyIgnore", data: "# 1. Empty file, nothing will be ignored" },
		{ name: "invalidIgnore", data: "www.google.com" },
	];

	beforeAll(() => {
		// Set up some mocked out file info before each test
		fs.__setMockFiles(MOCK_FILE_INFO);
	});

	test("Ignore google links", () => {
		expect(ignoreUrl(urls, "googleIgnore")).toEqual([
			"https://www.example.com/",
			"https://www.senecacollege.com/",
		]);
	});

	test("Empty ignore file, nothing ignored", () => {
		expect(ignoreUrl(urls, "emptyIgnore")).toEqual(urls);
	});

	test("Invalid Ignore file, throws error", () => {
		expect(() => ignoreUrl(urls, "invalidIgnore")).toThrow("Invalid Ignore File");
	});

	test("Error Reading Ignore File", () => {
		expect(() => ignoreUrl(urls, "errorFile")).toThrow("!!Error Reading Ignore File!!");
	});
});
