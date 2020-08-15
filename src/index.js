/**
 * vim: syntax=javascript expandtab tabstop=4 shiftwidth=4 softtabstop=4:
 */

// Node core requires
const fs = require('fs');
const path = require('path');
const process = require('process');

// Supporting library requires
const axios = require('axios');

// Configuration settings
const configFile = path.resolve(process.env.HOME, '.currex.json');

// Base URL for axios queries
axios.defaults.baseURL = 'https://api.exchangeratesapi.io';

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

// Run the main process as an async operation
(async () => {
    try {
        fs.access(configFile, async (error) => {
            let config;

            // File not found
            if (error && error.code === 'ENOENT') {
                await getLatest();
            }

            // Get the file stats of the config file
            await fs.stat(configFile, async (statError, stats) => {
                if (statError) {
                    throw statError;
                }

                // If the data is older than 1 hour, get it from the server again
                if (stats.mtimeMs < (Date.now() - 3600000)) {
                    await getLatest();
                }
            });

            // Read the config from config file
            await fs.readFile(configFile, { encoding: 'utf8' }, (readFileError, data) => {
                if (readFileError) {
                    throw readFileError;
                }

                config = JSON.parse(data);

                console.log(config);
            });
        });
    } catch (error) {
        console.error(error);
    }
})();
