const { getDriver, By, until } = require('../setup');
const { expect } = require('chai');

describe('Trip Builder E2E Tests', function () {
    let driver;
    const baseUrl = 'http://localhost:3000';

    before(async function () {
        driver = await getDriver();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should complete the Trip Builder flow', async function () {
        await driver.get(baseUrl + '/trip-builder.html');

        // Step 1: Destination & Dates
        const fromCity = await driver.wait(until.elementLocated(By.id('from-city-select')), 5000);
        await fromCity.sendKeys('Mumbai'); // Using keyboard shortcut to select or click option

        const destination = await driver.findElement(By.id('destination-select'));
        await destination.sendKeys('Goa');

        // Set Dates (using JS because date inputs can be tricky with Selenium sendKeys)
        await driver.executeScript("document.getElementById('trip-date').value = '2025-12-01'");
        await driver.executeScript("document.getElementById('return-date').value = '2025-12-05'"); // Crucial fix added

        const travelers = await driver.findElement(By.id('trip-travelers'));
        await travelers.sendKeys('2 Travelers');

        const nextBtn1 = await driver.findElement(By.css('button[onclick="goToStep(2)"]'));
        await nextBtn1.click();

        // Step 2: Accommodation
        const hotelOption = await driver.wait(until.elementLocated(By.id('hotel-standard')), 5000);
        await driver.executeScript("arguments[0].click();", hotelOption); // Force click if label overlaps

        const nextBtn2 = await driver.findElement(By.css('button[onclick="goToStep(3)"]'));
        await nextBtn2.click();

        // Step 3: Transport
        const transportOption = await driver.wait(until.elementLocated(By.id('transport-flight')), 5000);
        await driver.executeScript("arguments[0].click();", transportOption);

        const nextBtn3 = await driver.findElement(By.css('button[onclick="goToStep(4)"]'));
        await nextBtn3.click();

        // Step 4: Activities
        const activity1 = await driver.wait(until.elementLocated(By.id('activity-sightseeing')), 5000);
        await driver.executeScript("arguments[0].click();", activity1);

        const nextBtn4 = await driver.findElement(By.css('button[onclick="goToStep(5)"]'));
        await nextBtn4.click();

        // Step 5: Review & Book
        await driver.wait(until.elementLocated(By.id('step-5')), 5000);

        // Verify Summary
        const summaryDest = await driver.findElement(By.id('summary-destination')).getText();
        expect(summaryDest).to.contain('Goa');

        const bookBtn = await driver.findElement(By.css('button[onclick="saveTripAndBook()"]'));
        await bookBtn.click();

        // Should redirect to booking.html
        await driver.wait(until.urlContains('booking.html'), 5000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('booking.html');
    });
});
