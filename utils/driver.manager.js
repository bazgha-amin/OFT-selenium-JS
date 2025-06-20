const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const configManager = require('./config.manager');
const addContext = require("mochawesome/addContext");
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { Browser } = require("selenium-webdriver");
const Logger = require('../utils/logger.util');

class DriverManager {
    static _instance;
    constructor() {
        if (DriverManager._instance) {
            return DriverManager._instance;
        }
        this.driver = null;
        this.timeout = parseInt(process.env.TIMEOUT) || 10000;
        DriverManager._instance = this;
    }

    static getInstance() {
        if (!DriverManager._instance) {
            DriverManager._instance = new DriverManager();
        }
        return DriverManager._instance;
    }

    //Initialize WebDriver based on browser specified in .env

    async initializeDriver() {
        try {
            const browser = configManager.getBrowser().toLowerCase();
            Logger.info(`Initializing ${browser} browser...`);

            const options = this.getBrowserOptions(browser);
            const builder = new Builder().forBrowser(browser);

            if (browser === 'chrome') {
                builder.setChromeOptions(options);
            } else if (browser === 'firefox') {
                builder.setFirefoxOptions(options);
            } else if (browser === 'edge') {
                builder.setEdgeOptions(options);
            }
            this.driver = await builder.build();

            // Set implicit wait and maximize window
            await this.driver.manage().setTimeouts({ implicit: 10000 });
            await this.driver.manage().window().maximize();

            Logger.info(`${browser} browser initialized successfully`);
            return this.driver;

        } catch (error) {
            Logger.error('Failed to initialize driver:', error);
            throw error;
        }
    }

    //Get browser-specific options based on .env settings

    getBrowserOptions(browser) {
        const isHeadless = process.env.HEADLESS === 'true';

        switch (browser) {
            case 'chrome':
                const chromeOptions = new chrome.Options();
                if (isHeadless) {
                    chromeOptions.addArguments('--headless');
                }
                chromeOptions.addArguments('--no-sandbox');
                chromeOptions.addArguments('--disable-dev-shm-usage');
                chromeOptions.addArguments('--disable-gpu');
                chromeOptions.addArguments('--window-size=1920,1080');
                chromeOptions.setLoggingPrefs({ performance: 'ALL' });
                return chromeOptions;

            case 'firefox':
                const firefoxOptions = new firefox.Options();
                if (isHeadless) {
                    firefoxOptions.addArguments('--headless');
                }
                firefoxOptions.addArguments('--width=1920');
                firefoxOptions.addArguments('--height=1080');
                return firefoxOptions;

            case 'edge':
                const edgeOptions = new edge.Options();
                if (isHeadless) {
                    edgeOptions.addArguments('--headless');
                }
                edgeOptions.addArguments('--no-sandbox');
                edgeOptions.addArguments('--disable-dev-shm-usage');
                return edgeOptions;

            default:
                throw new Error(`Unsupported browser: ${browser}`);
        }
    }

    //Navigate to URL based on environment specified in .env

    async navigateToBaseUrl() {
        try {
            if (!this.driver) {
                throw new Error('Driver not initialized. Call initializeDriver() first.');
            }

            const baseUrl = configManager.getBaseUrl();
            const environment = configManager.getEnvironment();

            Logger.info(`Navigating to ${environment} environment: ${baseUrl}`);
            await this.driver.get(baseUrl);

            await this.driver.wait(async () => {
                const title = await this.driver.getTitle();
                return title && title.length > 0;
            }, this.timeout);

            Logger.info(`Successfully navigated to: ${baseUrl}`);

        } catch (error) {
            Logger.error('Failed to navigate to base URL:', error);
            throw error;
        }
    }

    //Take screenshot for failed case

    async takeScreenshotOnFailure(testContext) {
        try {
            if (!this.driver) {
                Logger.info('Driver not available for screenshot');
                return;
            }

            if (!testContext || testContext.state !== 'failed') {
                return;
            }

            const screenshotDir = path.join(process.cwd(), 'mochawesome-report/screenshots');

            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, { recursive: true });
            }

            const fileName = `${testContext.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
            const filePath = path.join(screenshotDir, fileName);

            const screenshot = await this.driver.takeScreenshot();
            fs.writeFileSync(filePath, screenshot, 'base64');

            Logger.error(`Failure screenshot saved: ${filePath}`);
            return filePath;

        } catch (error) {
            Logger.error('Failed to take failure screenshot:', error);
        }
    }


    //Close current browser window
    async closeBrowser() {
        try {
            if (this.driver) {
                await this.driver.close();
                Logger.info('Browser window closed');
            }
        } catch (error) {
            Logger.error('Failed to close browser:', error);
        }
    }


    //Quit driver and dispose all resources
    async quitDriver() {
        try {
            if (this.driver) {
                await this.driver.quit();
                this.driver = null;
                Logger.info('Driver disposed successfully');
            }
        } catch (error) {
            Logger.error('Failed to quit driver:', error);
        }
    }


    //Browser Setup: Initialize driver and navigate to base URL
    async setupDriver() {
        await this.initializeDriver();
        await this.navigateToBaseUrl();
        return this.driver;
    }
}

module.exports = DriverManager;