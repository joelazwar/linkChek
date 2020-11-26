const { argIdentify } = require("./argIdentify");

describe("err", () => {
	test("Test invalid file passed", () => {
		expect(() => argIdentify("testFile").toThrow("File not found"));
	});
});
