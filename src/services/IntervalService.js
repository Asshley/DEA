class IntervalService {
  static initiate(client, modules) {
    for (let i = 0; i < modules.length; i++) {
      const Interval = modules[i];

      new Interval(client).tick();
    }
  }
}

module.exports = IntervalService;
