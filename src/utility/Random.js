const MAX_POSSIBLE = 100;

class Random {
  static nextInt(min, max) {
    return ~~(Math.random() * (max - min)) + min;
  }

  static nextFloat(min, max) {
    return this.nextInt(min * MAX_POSSIBLE, (max * MAX_POSSIBLE) + 1) / MAX_POSSIBLE;
  }

  static roll() {
    return this.nextFloat(0, MAX_POSSIBLE);
  }

  static arrayElement(array) {
    return array[this.nextInt(0, array.length)];
  }
}

module.exports = Random;
