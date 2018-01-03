export default class Event {

  constructor(type, target, details = {}) {
    this.type = type;
    this.target = target;
    Object.entries(details).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}
