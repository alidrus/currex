/**
 * vim: syntax=javascript expandtab tabstop=4 shiftwidth=4 softtabstop=4:
 */

// Node core requires
const process = require('process');

// String constants
const HELP_USAGE = 'Usage: currex --from <from currency> --to <to currency> <amount>\n'
    + '       or\n'
    + '       currex --list\n';
const ERROR_INVALID_CURRENCY = 'Error: %s is not a valid currency\n';
const ERROR_INVALID_AMOUNT = 'Error: %s is not a valid amount\n';

// Show command line usage
const usage = (exitStatus = null) => {
    process.stderr.write(HELP_USAGE);

    if (exitStatus !== null) {
        process.exit(exitStatus);
    }
};

const error = (errorMessage, exitStatus = null, callback = null) => {
    process.stderr.write(errorMessage, () => {
        if (callback) {
            callback(exitStatus);
        }
    });

    if (exitStatus !== null) {
        process.exit(exitStatus);
    }
};

module.exports = {
    ERROR_INVALID_AMOUNT,
    ERROR_INVALID_CURRENCY,
    HELP_USAGE,
    error,
    usage,
};
