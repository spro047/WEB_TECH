const { getDriver, By, until } = require('../setup');
const { expect } = require('chai');

describe('Home Page UI Tests', function () {
    let driver;
    const baseUrl = 'http://localhost:3000'; // Updated to match live-server port

    before(async function () {
        driver = await getDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should load the home page and check title', async function () {
        await driver.get(baseUrl + '/index.html');
        const title = await driver.getTitle();
        expect(title).to.include('TravelPlanner');
    });

    it('should display the main navigation', async function () {
        await driver.get(baseUrl + '/index.html');
        const navbar = await driver.wait(until.elementLocated(By.className('navbar')), 5000);
        expect(await navbar.isDisplayed()).to.be.true;
    });

    it('should have a working "Holidays" link', async function () {
        await driver.get(baseUrl + '/index.html');
        const holidaysLink = await driver.findElement(By.linkText('Holidays'));
        await holidaysLink.click();
        await driver.wait(until.titleContains('Holiday'), 5000);
        const title = await driver.getTitle();
        expect(title).to.include('Holiday');
    });
});
