export default class Request {

  constructor(xmlHttpRequest) {
    this.container = xmlHttpRequest;
  }

  cancel() {
    this.container.abort();
  }

  get status() {
    this.container.status;
  }
}
