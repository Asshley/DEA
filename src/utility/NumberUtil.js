const HOURS_TO_MS = 36e5;
const DIVISOR = 100;
const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

class NumberUtil {
  static fromValue(input) {
    return input * DIVISOR;
  }

  static value(input) {
    return input / DIVISOR;
  }

  static format(input) {
    return this.toUSD(this.value(input));
  }

  static hoursToMs(input) {
    return input * HOURS_TO_MS;
  }

  static msToTime(input) {
    /* eslint-disable no-magic-numbers */
    return {
      milliseconds: parseInt(input % 1000 / 100),
      seconds: parseInt(input / 1000 % 60),
      minutes: parseInt(input / (1000 * 60) % 60),
      hours: parseInt(input / (1000 * 60 * 60) % 24),
      days: parseInt(input / (1000 * 60 * 60 * 24))
    };
    /* eslint-enable no-magic-numbers */
  }

  static toUSD(num) {
    return formatter.format(num);
  }

  static round(num, dec) {
    return typeof dec === 'number' ? Number(num.toFixed(dec)) : Math.round(num);
  }
}

module.exports = NumberUtil;
