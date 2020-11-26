const { httpsOption } = require("./httpsOption.js");

describe("Http -> Https option", () => {
	test("Test array of urls", () => {
		const urls = ["http://google.com/", "https://google.ca/", "http://www.google.com/"];
		const urlResults = ["https://google.com/", "https://google.ca/", "https://www.google.com/"];

		expect(httpsOption(urls)).toStrictEqual(urlResults);
	});
});
