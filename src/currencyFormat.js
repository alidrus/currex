/**
 * vim: syntax=javascript expandtab tabstop=4 shiftwidth=4 softtabstop=4:
 */

const currencyFormat = (amount, currency) => {
    const formatted = new Intl.NumberFormat('en-US', {style: 'currency', currency, currencySign: 'standard'}).format(amount);
    return formatted;
};

module.exports = currencyFormat;
