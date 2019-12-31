export default class MessageResponseDTO {
  public command: string;
  public headers: Headers;
  public body: any;
}

export class Headers {
  public 'content-length': number;
  public 'content-type': string;
  public 'redelivered': boolean;
  public 'message-id': string;
  public 'destination': string;
  public 'subscription': string;
}

