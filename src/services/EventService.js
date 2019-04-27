class EventService {
  static initiate(client, modules) {
    for (let i = 0; i < modules.length; i++) {
      const Event = modules[i];

      new Event(client).listen();
    }
  }
}

module.exports = EventService;
