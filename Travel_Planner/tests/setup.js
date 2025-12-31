const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Common setup for all tests
const getDriver = async () => {
    let options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment to run in headless mode
    options.addArguments('--start-maximized');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    return driver;
};

module.exports = { getDriver, By, Key, until };
