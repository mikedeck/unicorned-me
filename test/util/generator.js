const fs = require('fs');
const path = require('path');

function loadTestCases(testDataDir) {
    const dataFiles = fs.readdirSync(testDataDir);
    const testCases = {};
    dataFiles.forEach((dataFile) => {
        testData = JSON.parse(fs.readFileSync(path.join(testDataDir, dataFile)));
        testCases[dataFile] = testData;
    });
    return testCases;
}

function generateTestSuite(testFile, testFunction) {
    const testName = path.basename(testFile, '.js');
    const testDir = path.dirname(testFile);
    const testDataDir = path.join(testDir, 'data', testName);
    const testCases = loadTestCases(testDataDir);
    for(key in testCases) {
        testData = testCases[key];
        it(key, testRunner(testFunction, testData));
    };
}

function testRunner(testFunction, testData) {
    return () => {
        testFunction(testData);
    }
}

module.exports = generateTestSuite;