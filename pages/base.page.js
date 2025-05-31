const { By, until, Key } = require('selenium-webdriver');
const Logger = require('../utils/logger.util');

class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.timeout = parseInt(process.env.TIMEOUT) || 10000;
    }

    async enterText(locator, text) {
        const element = await this.waitForElement(locator);
        await element.sendKeys(text);
    }

    async enterTextAfterClear(locator, text) {
        const element = await this.waitForElement(locator);
        await element.clear();
        await element.sendKeys(text);
    }

    async clickElement(locator) {
        const element = await this.waitForClickableElement(locator);
        await element.click();
    }

    async getText(locator) {
        const element = await this.waitForElement(locator);
        return await element.getText();
    }

    async isElementDisplayed(locator) {
        try {
            const element = await this.driver.findElement(locator);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    async isElementEnabled(locator) {
        const element = await this.waitForElement(locator);
        return await element.isEnabled();
    }

    async waitForElement(locator) {
        try {
            Logger.info(`Waiting for element: ${locator}`);
            return await this.driver.wait(until.elementLocated(locator), this.timeout);
        } catch (error) {
            Logger.error(`Element '${locator}' not found within ${this.timeout}ms`);
            throw new Error(`Element '${locator}' not found within ${this.timeout}ms`);
        }
    }

    async waitForClickableElement(locator) {
        Logger.info(`Waiting for element to be clickable: ${locator}`);
        const element = await this.waitForElement(locator);
        return await this.driver.wait(until.elementIsEnabled(element), this.timeout);
    }

    async waitForElementVisible(locator) {
        try {
            Logger.info(`Waiting for element to be visible: ${locator}`);
            const element = await this.driver.wait(until.elementLocated(locator), this.timeout);
            await this.driver.wait(until.elementIsVisible(element), this.timeout);
        } catch (error) {
            Logger.error(`Element '${locator}' not found within ${this.timeout}ms`);
            throw new Error(`Element '${locator}' not visible within ${this.timeout}ms`);
        }
    }

    async scrollIntoView(locator) {
        const element = await this.driver.findElement(locator);
        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    }

    async switchToIframeByIndex(index) {
        const iframes = await this.driver.findElements(By.tagName('iframe'));
        if (index < iframes.length) {
            await this.driver.switchTo().frame(iframes[index]);
        } else {
            throw new Error(`Iframe index ${index} out of bounds. Total iframes found: ${iframes.length}`);
        }
    }

    async waitForNewTab() {
        await this.driver.wait(async () => {
            const handles = await this.driver.getAllWindowHandles();
            return handles.length > 1;
        }, this.timeout, 'New browser tab did not open in time');
    }

    async getTabCount() {
        const handles = await this.driver.getAllWindowHandles();
        return handles.length;
    }
}

module.exports = BasePage;