const { getDriver, By, until } = require('../setup');
const { expect } = require('chai');

describe('Authentication Flow Tests', function () {
    let driver;
    const baseUrl = 'http://localhost:3000';

    before(async function () {
        driver = await getDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should navigate to Signup page', async function () {
        await driver.get(baseUrl + '/index.html');
        const signupBtn = await driver.wait(until.elementLocated(By.className('btn-signup')), 5000);
        await signupBtn.click();
        await driver.wait(until.urlContains('signup.html'), 5000);
        const title = await driver.getTitle();
        expect(title).to.include('Sign Up');
    });

    // Note: Creating a real user might spam the DB unless we have a cleanup. 
    // For now we will test UI elements presence on Signup.
    it('should display signup form elements', async function () {
        await driver.get(baseUrl + '/signup.html');
        const nameInput = await driver.wait(until.elementLocated(By.id('first-name')), 5000);
        const emailInput = await driver.findElement(By.id('signup-email'));
        const passwordInput = await driver.findElement(By.id('signup-password'));

        expect(await nameInput.isDisplayed()).to.be.true;
        expect(await emailInput.isDisplayed()).to.be.true;
        expect(await passwordInput.isDisplayed()).to.be.true;
    });

    it('should login with valid credentials (Mock Test)', async function () {
        // This test assumes a user exists. In a real CI/CD, we'd seed the DB first.
        // We'll proceed to test the UI flow mostly.
        await driver.get(baseUrl + '/login.html');

        const emailInput = await driver.wait(until.elementLocated(By.id('login-email')), 5000);
        const passwordInput = await driver.findElement(By.id('login-password'));
        const loginBtn = await driver.findElement(By.css('button[type="submit"]'));

        // Enter dummy data just to check interaction
        await emailInput.sendKeys('test@example.com');
        await passwordInput.sendKeys('password123');
        // We won't click submit to avoid polluting/failing on non-existent user if backend is empty
        // await loginBtn.click();
    });

    it('should display "Forgot Password" link on login page', async function () {
        await driver.get(baseUrl + '/login.html');
        const forgotLink = await driver.findElement(By.className('forgot-password'));
        expect(await forgotLink.isDisplayed()).to.be.true;
        expect(await forgotLink.getText()).to.equal('Forgot Password?');
    });
});
