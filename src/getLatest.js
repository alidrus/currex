/**
 * vim: syntax=javascript expandtab tabstop=4 shiftwidth=4 softtabstop=4:
 */

// Node core requires
const fs = require('fs');
const path = require('path');
const process = require('process');

// Supporting library requires
const axios = require('axios');

// Base URL for axios queries
axios.defaults.baseURL = 'https://api.exchangeratesapi.io';

// Configuration settings
const configFile = path.resolve(process.env.HOME, '.currex.json');

// Get latest exchange rates with MYR as the base currency
const getLatest = async () => {
    let data;

    // Get latest data from server
    await axios.get('/latest', {
        params: {
            base: 'MYR',
        },
    }).then((response) => {
        data = response.data;
    }).catch((axiosError) => {
        throw axiosError;
    });

    // Write the data to the config file
    await fs.writeFile(configFile, JSON.stringify(data), (writeError) => {
        if (writeError) {
            throw writeError;
        }
    });
};

module.exports = getLatest;
