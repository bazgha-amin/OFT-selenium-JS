const DriverManager = require('../utils/driver.manager');
const { By, until } = require('selenium-webdriver');
const StudioPage = require('../pages/studio.page');
const CommonUtils = require('../utils/common.utils');
const assert = require('assert');
const { expect } = require('chai');
const addContext = require("mochawesome/addContext");
const path = require('path');

describe('Studio Page Tests', function () {
  this.timeout(50000);

  let driverManager;
  let driver;
  let studioPage;

  beforeEach(async () => {
    driverManager = new DriverManager();
    driver = await driverManager.setupDriver();
    studioPage = new StudioPage(driver); 
  });

  afterEach(async function () {
    if (this.currentTest?.state === 'failed') {
      const screenshotPath = await driverManager.takeScreenshotOnFailure(this.currentTest);
      if (screenshotPath) {
        addContext(this, {
          title: 'Screenshot on Failure',
          value: `screenshots/${path.basename(screenshotPath)}`
        });
      }
    }

    if (driverManager) {
      await driverManager.closeBrowser();
      await driverManager.quitDriver();
    }
  });

  it.only('should navigate to Locations page and verify Studio info', async () => {
    await studioPage.goToLocationsPage();
    await studioPage.switchIframe('locationsIframe');
    const studioDetails = await studioPage.getStudioInfo();
    assert.ok(studioDetails && studioDetails.length > 0, 'Studio details should not be null or empty');
    await studioPage.clickJoinNow();
    await studioPage.switchOutOfIframe();
    await studioPage.clickBookNow();
    await studioPage.waitForElementVisible(studioPage.elements.studioNameAfter);
    const studioName = await studioPage.getText(studioPage.elements.studioNameAfter);
    assert.strictEqual(
    studioName.trim(),
    studioDetails[0].name.trim(),
    'Studio name after booking should match the selected studio'
  );
  });

  it.only('Form with empty data should display mandatory fields messages', async () => {
    await studioPage.goToLocationsPage();
    await studioPage.switchIframe('locationsIframe');
    const studioDetails = await studioPage.getStudioInfo();
    await studioPage.clickJoinNow();
    await studioPage.switchOutOfIframe();
    await studioPage.clickBookNow();
    await studioPage.waitForElementVisible(studioPage.elements.studioNameAfter);
    await studioPage.switchIframe('bookClassIframe');
    // await studioPage.waitForElementVisible(studioPage.elements.introForm);
    //await studioPage.scrollIntoView(studioPage.elements.nextBtn);
    await driver.sleep(5000);
    // await studioPage.clickElement(studioPage.elements.nextBtn);
    await studioPage.clickNext();
    expect(await studioPage.getErrorMessageText("firstName")).to.equal("Field is required");
    expect(await studioPage.getErrorMessageText("lastName")).to.equal("Field is required");
    expect(await studioPage.getErrorMessageText("email")).to.equal("Field is required");
  });

  it('clicking SMS & MMS link should open in a new tab', async () => {
    await studioPage.goToLocationsPage();
    await studioPage.switchIframe('locationsIframe');
    const studioDetails = await studioPage.getStudioInfo();
    await driver.sleep(5000);
    await studioPage.clickJoinNow();
    await studioPage.switchOutOfIframe();
    await studioPage.clickBookNow();
    await studioPage.waitForElementVisible(studioPage.elements.studioNameAfter);
    await studioPage.switchIframe('bookClassIframe');
    await studioPage.waitForElementVisible(studioPage.elements.introForm);
    await studioPage.clickElement(studioPage.elements.smsMmsLink);
    await studioPage.waitForNewTab();
    const tabCount = await studioPage.getTabCount();
    assert.strictEqual(tabCount, 2, 'New tab is not opened after clicking hyperlink');

  });
});