const { getDriver, By, until } = require('../setup');
const { expect } = require('chai');

describe('Profile Management Tests', function () {
    let driver;
    // Assuming the app runs on port 3000 based on existing tests.
    // If tests fail due to connection, we might need to change this or start the server.
    const baseUrl = 'http://localhost:3000';

    before(async function () {
        driver = await getDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should navigate to Profile page', async function () {
        await driver.get(baseUrl + '/profile.html');
        // Wait for title to ensure page load
        await driver.wait(until.titleContains('Profile'), 5000);
        const title = await driver.getTitle();
        expect(title).to.include('My Profile');
    });

    it('should display all profile form fields', async function () {
        await driver.get(baseUrl + '/profile.html');

        // Wait for at least one element to be located to ensure DOM is ready
        const nameInput = await driver.wait(until.elementLocated(By.id('profile-name')), 5000);
        const emailInput = await driver.findElement(By.id('profile-email'));
        const phoneInput = await driver.findElement(By.id('profile-phone'));
        const dobInput = await driver.findElement(By.id('profile-dob'));
        const addressInput = await driver.findElement(By.id('profile-address'));
        const updateBtn = await driver.findElement(By.css('button[type="submit"]'));

        expect(await nameInput.isDisplayed()).to.be.true;
        expect(await emailInput.isDisplayed()).to.be.true;
        expect(await phoneInput.isDisplayed()).to.be.true;
        expect(await dobInput.isDisplayed()).to.be.true;
        expect(await addressInput.isDisplayed()).to.be.true;
        // updateBtn might be displayed or scroll required? Usually displayed.
        // If sticky header/footer covers it, click might fail, but isDisplayed should be true if visible in viewport or just rendered?
        // Selenium isDisplayed requires element to be visible to user.
        expect(await updateBtn.isDisplayed()).to.be.true;
    });

    it('should create/update profile successfully', async function () {
        await driver.get(baseUrl + '/profile.html');

        const nameInput = await driver.wait(until.elementLocated(By.id('profile-name')), 5000);
        const emailInput = await driver.findElement(By.id('profile-email'));
        const phoneInput = await driver.findElement(By.id('profile-phone'));
        const dobInput = await driver.findElement(By.id('profile-dob'));
        const addressInput = await driver.findElement(By.id('profile-address'));
        const updateBtn = await driver.findElement(By.css('button[type="submit"]'));

        // Fill form
        await nameInput.clear();
        await nameInput.sendKeys('Test User');
        await emailInput.clear();
        await emailInput.sendKeys('testuser@example.com');
        await phoneInput.clear();
        await phoneInput.sendKeys('1234567890');
        await dobInput.sendKeys('01-01-2000'); // Date input format can be tricky. trying standard DD-MM-YYYY or YYYY-MM-DD
        // Chrome En-US often expects mm-dd-yyyy or just yyyy-mm-dd. Let's send keys loosely or use JS to set if needed.
        // A safer way for date inputs if sendKeys is flaky:
        // await driver.executeScript("arguments[0].value = '2000-01-01';", dobInput);
        // But let's try sendKeys first.

        await addressInput.clear();
        await addressInput.sendKeys('123 Test Street');

        // Scroll to button to ensure it's clickable (if covered by footer)
        await driver.executeScript("arguments[0].scrollIntoView(true);", updateBtn);
        // Small pause for scroll
        await driver.sleep(500);

        await updateBtn.click();

        // Handle Alert
        try {
            await driver.wait(until.alertIsPresent(), 5000);
            const alert = await driver.switchTo().alert();
            const alertText = await alert.getText();
            expect(alertText).to.include('successfully'); // "Profile updated successfully!"
            await alert.accept();
        } catch (error) {
            throw new Error('Expected success alert was not shown or text mismatch: ' + error.message);
        }

        // Verify data persistence
        // Reload page
        await driver.get(baseUrl + '/profile.html');

        // Re-locate elements
        const nameInputRelocated = await driver.wait(until.elementLocated(By.id('profile-name')), 5000);

        // Wait for value to be populated from localStorage
        await driver.wait(async () => {
            const val = await nameInputRelocated.getAttribute('value');
            return val === 'Test User';
        }, 5000, 'Name field did not retain value "Test User"');

        const storedEmail = await driver.findElement(By.id('profile-email')).getAttribute('value');
        expect(storedEmail).to.equal('testuser@example.com');
    });
});
