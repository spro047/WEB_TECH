/* eslint-env mocha */
const { getDriver, By, until } = require('../setup');
const { expect } = require('chai');

describe('Navigation & Static Pages Tests', function () {
    let driver;
    const baseUrl = 'http://localhost:3000';

    // List of public pages to test with expected title fragments
    const pages = [
        { url: '/holidays.html', title: 'Holiday' },
        { url: '/flights.html', title: 'Flight' },
        { url: '/hotels.html', title: 'Hotel' },
        { url: '/support.html', title: 'Support' },
        // my-trips.html is excluded here as it requires authentication
        { url: '/trip-builder.html', title: 'Trip Builder' }
    ];

    before(async function () {
        driver = await getDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    // Test Public Pages
    pages.forEach(page => {
        describe(`Page: ${page.url}`, function () {
            it(`should load and have correct title containing "${page.title}"`, async function () {
                await driver.get(baseUrl + page.url);
                const title = await driver.getTitle();
                expect(title).to.include(page.title);
            });

            it('should display the main navigation bar', async function () {
                await driver.get(baseUrl + page.url);
                const navbar = await driver.wait(until.elementLocated(By.className('navbar')), 2000);
                expect(await navbar.isDisplayed()).to.be.true;
            });

            it('should display the footer', async function () {
                await driver.get(baseUrl + page.url);
                const footer = await driver.wait(until.elementLocated(By.className('footer')), 2000);
                await driver.executeScript("arguments[0].scrollIntoView(true);", footer);
                expect(await footer.isDisplayed()).to.be.true;
            });
        });
    });

    // Test Protected Pages
    describe('Page: /my-trips.html (Protected)', function () {
        it('should redirect to login page when not authenticated', async function () {
            // Ensure we start from a clean state
            await driver.get(baseUrl + '/index.html');
            await driver.executeScript("localStorage.removeItem('token');");

            await driver.get(baseUrl + '/my-trips.html');

            // Should redirect to login
            await driver.wait(until.urlContains('login.html'), 5000);
            const title = await driver.getTitle();
            expect(title).to.include('Login');
        });

        it('should load My Trips page when authenticated', async function () {
            // Mock a successful login by setting the token
            await driver.get(baseUrl + '/index.html');
            await driver.executeScript("localStorage.setItem('token', 'mock_token');");

            await driver.get(baseUrl + '/my-trips.html');

            // Should stay on my-trips page
            await driver.wait(until.urlContains('my-trips.html'), 5000);
            const title = await driver.getTitle();
            expect(title).to.include('My Trips');

            // Verify page elements
            const navbar = await driver.wait(until.elementLocated(By.className('navbar')), 2000);
            expect(await navbar.isDisplayed()).to.be.true;

            // Cleanup
            await driver.executeScript("localStorage.removeItem('token');");
        });
    });
});
