jest.mock("node-fetch");

const fetch = require("node-fetch");
const { validateUrl } = require("../src/validateUrl.js");

describe("200 and 404 Responses", () => {
	beforeEach(() => {
		fetch.mockClear();
	});

	const url = "http://example.com/";

	test("Test valid url (200)", async () => {
		fetch.mockReturnValue({ status: 200 });

		const urlResult = await validateUrl(url);

		expect(urlResult).toEqual({ url: url, status: 200 });
	});

	test("Test invalid url (404)", async () => {
		fetch.mockReturnValue({ status: 404 });

		const urlResult = await validateUrl(url);

		expect(urlResult).toEqual({ url: url, status: 404 });
	});

	test("Fetch timeout", async () => {
		fetch.mockImplementation(() => {
			throw { type: "request-timeout" };
		});

		const urlResult = await validateUrl(url);

		expect(urlResult).toEqual({ url: url, status: -2 });
	});

	test("Misc. error", async () => {
		fetch.mockImplementation(() => {
			throw new Error();
		});

		const urlResult = await validateUrl(url);

		expect(urlResult).toEqual({ url: url, status: -1 });
	});
});
