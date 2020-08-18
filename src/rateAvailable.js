/**
 * vim: syntax=javascript expandtab tabstop=4 shiftwidth=4 softtabstop=4:
 */

const rateAvailable = (rates, rate) => Object.prototype.hasOwnProperty.call(
    rates,
    rate,
);

module.exports = rateAvailable;
