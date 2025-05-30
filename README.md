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
- **Design Pattern**: Page Object Model (POM)  
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


## **⚙️ Setup Instructions**

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/bazgha-amin/OFT-selenium-JS.git
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

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



