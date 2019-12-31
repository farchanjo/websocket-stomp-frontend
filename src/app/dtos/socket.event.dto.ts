export enum SocketEvent {
  START, STOP
}

export class SocketEventDTO {
  public event: SocketEvent;
  public message: string;


  constructor(event: SocketEvent, message: string) {
    this.event = event;
    this.message = message;
  }
}
