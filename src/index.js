/**
 * vim: syntax=javascript expandtab tabstop=4 shiftwidth=4 softtabstop=4:
 */

// Node core requires
const fs = require('fs');
const path = require('path');
const process = require('process');

// Supporting library requires
const minimist = require('minimist');

// Local requires
const getLatest = require('./getLatest');

// Configuration settings
const configFile = path.resolve(process.env.HOME, '.currex.json');

// Process the command line arguments
const options = minimist(process.argv.slice(2));

if (!Object.prototype.hasOwnProperty.call(options, 'from')
    || !Object.prototype.hasOwnProperty.call(options, 'to')
    || !Object.prototype.hasOwnProperty.call(options, '_')) {
    // Display usage
    console.error('Usage: currex --from|-f <from currency> --to <to currency> <amount>');

    // Exit with error
    process.exit(1);
}

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
