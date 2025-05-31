# OrangeTheoryFitness Automation Framework

This is a Selenium-based test automation framework built using **JavaScript**, designed to test user flows on the OrangeTheoryFitness platform. The framework uses **Mocha** as the test runner, **Chai** for assertions, and **Mochawesome** for test reporting.

## ✅ Sample Use Cases Covered
- Navigate to Studio locations and verify info
- Clicking the hyperlink opens a new tab and verifying the tab is opened  
- Switch between iframes to interact with embedded booking flows  
- Submit forms with missing required fields and verify error messages  
- Generate dynamic user data for membership agreement URL  
- Intercept `/validate` POST request from browser’s network log and assert payload values

## **🛠️ Tech Stack**
- **Automation Tool**: Selenium WebDriver  
- **Language**: JavaScript (Node.js)  
- **Test Runner**: Mocha  
- **Assertion Library**: Chai  
- **Runtime environment configuration**: Dotenv
- **Reporting**: Mochawesome


## 📁 Project Structure

```text
Project Structure
├── config/
│   └── environment.config.json      # Environment-specific URLs
├── pages/
│   ├── base.page.js                 # Common reusable page functions
│   └── studio.page.js               # Page object for Studio workflows
├── test/
│   ├── dataBlob.test.js             # Tests for dynamic data blob encoding/decoding
│   └── studio.test.js               # Tests for Studio info and booking flow
├── utils/
│   ├── driver.manager.js            # WebDriver setup and teardown
│   ├── config.manager.js            # Loads .env and environment JSON config
│   └── common.utils.js              # Utility functions
├── .env                             # Environment variables (browser, environment, headless etc.)
├── package.json                     # Project metadata and dependencies
└── mochawesome-report/              # Directory for generated test reports
```
## Design Patterns & Best Practices

- ✅ **Singleton Pattern** for WebDriver: Ensures only one driver instance is used throughout the test suite.
- ✅ **Page Object Model (POM)**: Promotes code reusability and maintainability.
- ✅ **Centralized Logging**: All test logs go through a custom `Logger` utility (`logger.util.js`) for standardized output.
- ✅ **Configurable Timeout**: WebDriver's wait timeout is defined via `.env` for flexibility across environments (local, CI, etc.).

---

## **⚙️ Setup Instructions**

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/bazgha-amin/OFT-selenium-JS.git
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure Environment Variables**
Create a .env file in the root directory (if not present) and set your configuration:
```bash
BROWSER=chrome
ENVIRONMENT=QA
HEADLESS=true
TIMEOUT=10000
```
BROWSER: chrome, firefox
ENVIRONMENT: must match a key in environment.config.json
HEADLESS: true or false
TIMEOUT: default wait time (in ms) for locating elements

---

## **▶️ Run Tests**

### **Run All Tests**
```bash
npm test
```

### **Run a Specific Test File**
```bash
npx mocha test/studio.test.js
```
## **📊 View Test Report**

After running tests, open the generated Mochawesome HTML report:

```bash
./mochawesome-report/mochawesome.html
```

This report includes:
- Test results
- Errors (if any)
- Failure screenshots with context

---

## **📊 Logging Example**

The framework uses logger.util.js for consistent log output:

```bash
[INFO] 2025-05-31T08:00:00.000Z - Initializing chrome browser...
[ERROR] 2025-05-31T08:01:10.000Z - Failed to locate element: studioName
```


