export default class ChatMessageDTO {
  public message: string;
  public sender: string;
  public serverDate: Date;
  public subject: string;
  public clientDate: Date;
  public destination: string;
  public destinationName: string;
  public isPrivate: boolean;


  constructor(message: string, destination: string, isPrivate: boolean, clientDate: Date) {
    this.clientDate = clientDate;
    this.message = message;
    this.destination = destination;
    this.isPrivate = isPrivate;
  }
}
