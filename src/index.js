/**
 * vim: syntax=javascript expandtab tabstop=4 shiftwidth=4 softtabstop=4:
 */

// Node core requires
const fs = require('fs');
const path = require('path');
const process = require('process');
const util = require('util');

// Supporting library requires
const minimist = require('minimist');

// Local requires
const getLatest = require('./getLatest');
const help = require('./help');

// Currency list
const currencyList = require('./currencyList.json');

// Configuration settings
const configFile = path.resolve(process.env.HOME, '.currex.json');

// Process the command line arguments
const options = minimist(process.argv.slice(2));

if ((!Object.prototype.hasOwnProperty.call(options, 'from')
    || !Object.prototype.hasOwnProperty.call(options, 'to')
    || !Object.prototype.hasOwnProperty.call(options, '_'))
    && !Object.prototype.hasOwnProperty.call(options, 'list')) {
    // Display usage
    help.usage(1);
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
            await fs.readFile(configFile, { encoding: 'utf8' }, async (readFileError, data) => {
                if (readFileError) {
                    throw readFileError;
                }

                // Parse the config
                config = JSON.parse(data);

                if (Object.prototype.hasOwnProperty.call(options, 'from')
                    && Object.prototype.hasOwnProperty.call(options, 'to')
                    && Object.prototype.hasOwnProperty.call(options, '_')) {
                    // Invalid from currency
                    if (!Object.prototype.hasOwnProperty.call(config.rates, options.from)) {
                        const errorMessage = util.format(help.ERROR_INVALID_CURRENCY, options.from);
                        help.error(errorMessage, 1, help.usage);
                    }

                    // Invalid to currency
                    if (!Object.prototype.hasOwnProperty.call(config.rates, options.to)) {
                        const errorMessage = util.format(help.ERROR_INVALID_CURRENCY, options.to);
                        help.error(errorMessage, 1, help.usage);
                    }

                    // Invalid amount
                    if (Number.isNaN(Number(options._))) {
                        const errorMessage = util.format(help.ERROR_INVALID_AMOUNT, options._);
                        help.error(errorMessage, 1, help.usage);
                    }

                    const fromRate = Number.parseFloat(config.rates[options.from]);
                    const toRate = Number.parseFloat(config.rates[options.to]);
                    const amount = Number.parseFloat(options._);

                    const exchangeAmount = (toRate / fromRate) * amount;

                    process.stdout.write(util.format('%s %s is equivalent to %s %s\n', options.from, amount.toFixed(2), options.to, exchangeAmount.toFixed(2)), () => {
                        process.exit(0);
                    });
                }

                if (Object.prototype.hasOwnProperty.call(options, 'list')) {
                    process.stdout.write('List of available currencies:\n', () => {
                        const availableCurrencies = Object.keys(config.rates).sort();

                        availableCurrencies.forEach((key) => {
                            const flushed = process.stdout.write(util.format('%s - %s\n', key, currencyList[key]));
                            while (!flushed) {
                                if (flushed) {
                                    break;
                                }
                            }
                        });

                        process.exit(0);
                    });
                }
            });
        });
    } catch (error) {
        // Dump the error to the console.
        process.stderr.write('Error: An unexpected error has occured. Details follow:\n', () => {
            console.error(error);
        });
    }
})();
