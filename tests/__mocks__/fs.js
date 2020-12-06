const fs = jest.createMockFromModule("fs");

let mockFiles = {};

function __setMockFiles(newMockFiles) {
	for (const file of newMockFiles) {
		mockFiles[file.name] = file.data;
	}
}

function readFileSync(fileName) {
	const data = mockFiles[fileName];

	if (data) {
		return data;
	} else {
		throw new Error();
	}
}

fs.__setMockFiles = __setMockFiles;
fs.readFileSync = readFileSync;

module.exports = fs;
