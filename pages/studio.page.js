const { By, until } = require('selenium-webdriver');
const BasePage = require('./base.page');

class StudioPage extends BasePage {
    constructor(driver) {
        super(driver);

        this.elements = {
            locationsLink: By.xpath("//a[text()='Locations' and contains(@class, 'w-nav')]"),
            studioCard: By.xpath("//div[contains(@id, 'location-card')]"),
            studioNameBefore: By.xpath(".//h2[starts-with(@id, 'location-name-')]"),
            studioAddressBefore: By.xpath(".//div[starts-with(@id, 'location-card-')]//p"),
            joinNowBtn: By.xpath("//button[text()='Join Now']"),
            bookNowBtn: By.xpath("//div[@class='navbar-button-wrap']//a[@id='try-class-navbar' and normalize-space(text())='Book Now']"),
            studioNameAfter: By.xpath("//div[@id = 'studio-info-name-title']"),
            nextBtn: By.xpath("//button[text()='Next']"),
            errorMessage: ("//span[@id='{0}-error']"),
            locationsIframe: By.id("locations-iframe"),
            bookClassIframe: By.id("book-class-1-frame"),
            introForm: By.xpath("//form[@data-testid='lead-form']"),
            smsMmsLink: By.xpath("//a[text()='SMS & MMS Terms of Service']"),
            firstName: By.xpath("//input[@name='firstName']"),
            lastName: By.xpath("//input[@name='lastName']"),
            email: By.xpath("//input[@name='email']"),
            
        };
    }

    async goToLocationsPage() {
        await this.clickElement(this.elements.locationsLink);
    }

    async clickBookNow() {
        await this.clickElement(this.elements.bookNowBtn);
    }

    async clickNext() {
        await this.scrollIntoView(this.elements.nextBtn);
        await this.driver.sleep(3000); 
        let element = await this.driver.wait(until.elementLocated(this.elements.nextBtn), this.timeout);
        await this.driver.wait(until.elementIsVisible(element), this.timeout);
        await this.driver.wait(until.elementIsEnabled(element), this.timeout);
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
        await element.click();;
    }

    async clickJoinNow() {
        await this.waitForClickableElement(this.elements.joinNowBtn);
        const buttons = await this.driver.findElements(this.elements.joinNowBtn);
        for (const btn of buttons) {
            const isDisplayed = await btn.isDisplayed();
            if (isDisplayed) {
                await this.driver.wait(until.elementIsVisible(btn), 5000);
                await this.driver.wait(until.elementIsEnabled(btn), 5000);
                await btn.click();
                break; 
            }
        }
    }

    async switchIframe(iframeName) {
        const iframeLocator = this.elements[iframeName];
        // Wait for iframe to be located and visible
        const iframe = await this.driver.wait(
            until.elementLocated(iframeLocator),
            10000 
        );

        await this.driver.wait(
            until.elementIsVisible(iframe),
            10000
        );

        await this.driver.switchTo().frame(iframe);
    }

    async switchOutOfIframe() {
        await this.driver.switchTo().defaultContent();
    }

    async getStudioInfo() {
        await this.waitForElementVisible(this.elements.studioCard);
        const studioCards = await this.driver.findElements(this.elements.studioCard);
        const studioDetails = [];

        for (let card of studioCards) {
            try {
                const isVisible = await card.isDisplayed();
                if (!isVisible) continue;

                const nameElement = await card.findElement(By.css('h2[id^="location-name"]'));
                const addressElement = await card.findElement(By.css('p.text-16'));

                const name = (await nameElement.getText()).trim();
                const address = (await addressElement.getText()).trim();

                if (name && address) {
                    studioDetails.push({ name, address });
                }

            } catch (e) {
                continue;
            }
        }

        return studioDetails;
    }

    async getErrorMessageText(fieldName) {
        const formattedXpath = this.elements.errorMessage.replace("{0}", fieldName);
        const formattedLocator = By.xpath(formattedXpath);
        await this.getText(formattedLocator);
    }
}

module.exports = StudioPage;