const DriverManager = require('../utils/driver.manager');
const { By, until } = require('selenium-webdriver');
const StudioPage = require('../pages/studio.page');
const CommonUtils = require('../utils/common.utils');
const assert = require('assert');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');
const addContext = require("mochawesome/addContext");
const path = require('path');

describe('Data Blob Encoding and Membership Agreement Page Tests', function () {
    this.timeout(60000);

    let driverManager;
    let driver;

    beforeEach(async () => {
        driverManager = new DriverManager();
        driver = await driverManager.setupDriver();
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

    it('should decode the original datablob from the provided URL', async () => {
        const url = "https://www.uat.orangetheory.com/en-us/membership-agreement?studioid=bf60d4c9-f9c3-4e5c-97f2-fe1118531493&data=ewogICJwZXJzb25faWQiOiAib3RmcWEzMTktYWE0OC00MmZhLTg4ODgtNTJmZjJlOTE0ZWEyMTk5IiwKICAibWVtYmVyX2VtYWlsIjogIm90ZnFhc0BvdXRsaWFudC5jb20iLAogICJtZW1iZXJfZmlyc3RfbmFtZSI6ICJPdXRsaWFudCIsCiAgIm1lbWJlcl9sYXN0X25hbWUiOiAiVGVzdGVyIiwKICAibWVtYmVyX3Bob25lX251bWJlciI6ICI0Mzc1NTUwMTIzIiwKICAic3R1ZGlvX2lkIjogImJmNjBkNGM5LWY5YzMtNGU1Yy05N2YyLWZlMTExODUzMTQ5MyIsCiAgIm1ib19zdHVkaW9faWQiOiAiNTcyOTY3OCIsCiAgIm1ib19jbGllbnRfaWQiOiAiOTg3NjUiLAogICJtYm9fY29udHJhY3RfaWQiOiAiMTIzNCIsCiAgIm1ib19jbGllbnRfY29udHJhY3RfaWQiOiAiMTIzNCIsCiAgIm1lbWJlcl9zdHJlZXRfYWRkcmVzcyI6ICIxMjMgTWFpbiBTdHJlZXQiLAogICJtZW1iZXJfY2l0eSI6ICJCb3N0b24iLAogICJtZW1iZXJfc3RhdGUiOiAiTUEiLAogICJtZW1iZXJfemlwIjogIjAyMTA4IiwKICAiY3JlZGl0X2NhcmRfbGFzdDQiOiAiMTIzNCIsCiAgImNyZWRpdF9jYXJkX3R5cGUiOiAiRElTQ09WRVIiLAogICJwcm9kdWN0X25hbWUiOiAiT25saW5lIEVsaXRlIEZhbWlseSBNZW1iZXJzaGlwIiwKICAicHJvZHVjdF90eXBlIjogIk1lbWJlcnNoaXAiLAogICJwcm9kdWN0X2NhdGVnb3J5IjogIkVsaXRlIiwKICAiaGFzX3Byb21vdGlvbiI6IHRydWUsCiAgImFkZF9vbiI6IHsKICAgICJ0eXBlIjogIkZBTUlMWSIsCiAgICAidmFsdWUiOiAiSm9obiBTdW1taXQiCn0sCiAgImNoZWNrX2lkIjp0cnVlLAogICJjb250cmFjdF9zdGFydF9kYXRlIjoiMjAzMi0wMi0yNVQwMDowMDowMCJ9";
        const decodedData = CommonUtils.decodeDataBlobFromUrl(url);
        assert.strictEqual(decodedData.member_first_name, 'Outliant', 'First Name is showing incorrect');
        assert.strictEqual(decodedData.member_last_name, 'Tester', 'Last name is showing incorrect');
        assert.strictEqual(decodedData.member_email, 'otfqas@outliant.com','Email is showing incorrect');
    });

    it('should generate a dynamic datablob, encode it, load the page, and verify displayed data', async () => {
        const data = {
            person_id: "custom-id-1234",
            member_email: CommonUtils.getRandomEmail(5),
            member_first_name: CommonUtils.generateRandomString(5),
            member_last_name: CommonUtils.generateRandomString(5),
            member_phone_number: "1234567890",
            studio_id: "bf60d4c9-f9c3-4e5c-97f2-fe1118531493",
            mbo_studio_id: "5729678",
            mbo_client_id: "98765",
            mbo_contract_id: "1234",
            mbo_client_contract_id: "1234",
            member_street_address: "123 Main Street",
            member_city: "Boston",
            member_state: "MA",
            member_zip: "02108",
            credit_card_last4: "1234",
            credit_card_type: "DISCOVER",
            product_name: "Online Elite Family Membership",
            product_type: "Membership",
            product_category: "Elite",
            has_promotion: true,
            add_on: {
                type: "FAMILY",
                value: "John Summit"
            },
            check_id: true,
            contract_start_date: "2025-05-30T00:00:00"
        };

        const encoded = CommonUtils.encodeDataBlob(data);
        const finalUrl = `https://www.uat.orangetheory.com/en-us/membership-agreement?location_id=bf60d4c9-f9c3-4e5c-97f2-fe1118531493&data=${encoded}`;
        await driver.get(finalUrl);
        // Wait to ensure /validate request is made and intercepted
        await driver.sleep(5000);

        const logs = await driver.manage().logs().get('performance');

        // Find /validate POST payload
        let validatePayload = null;
        for (const entry of logs) {
            try {
                const message = JSON.parse(entry.message).message;
                if (
                    message.method === 'Network.requestWillBeSent' &&
                    message.params.request.url.includes('/validate') &&
                    message.params.request.method === 'POST' &&
                    message.params.request.postData
                ) {
                    validatePayload = JSON.parse(message.params.request.postData);
                    console.log('Captured /validate POST payload:', validatePayload);
                    console.log('validatePayload:', JSON.stringify(validatePayload, null, 2));
                    break;
                }
            } catch (err) {
                console.error('Error parsing performance log:', err);
            }
        }

        assert(validatePayload, 'Expected /validate POST payload to be captured.');
        assert.strictEqual(validatePayload.data.member_first_name, data.member_first_name, "First Name is showing incorrect");
        assert.strictEqual(validatePayload.data.member_last_name, data.member_last_name, "Last Name is showing incorrect");
    });
});