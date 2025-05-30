require('dotenv').config();
const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.envConfig = this.loadEnvironmentConfig();
    }

    loadEnvironmentConfig() {
        const configPath = path.join(__dirname, '../config/environment.config.json');
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    getBrowser() {
        return process.env.BROWSER || 'chrome';
    }

    getEnvironment() {
        return process.env.ENVIRONMENT || 'QA';
    }

    getBaseUrl() {
        const env = this.getEnvironment();
        return this.envConfig[env]?.url;
    }

}

module.exports = new ConfigManager();