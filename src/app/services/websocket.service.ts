import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Serializer} from "@angular/compiler";

@Injectable({
  providedIn: 'root',
})
export default class WebsocketService {
  private stompClient: any;
  private session: any = null;

  constructor(private logger: NGXLogger) {
    this.createStompClient();
  }

  public connect(token: string, callback) {
    const self = this;
    if (!token) {
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    self.stompClient.connect(headers, (session) => {
      self.session = session;
      self.stompClient.reconnect_delay = 2000;
      self.logger.debug(`Logged with: ${session.headers['user-name']}`);
      callback(self.session);
    });
  }

  public subscribe(topic: string, receiverCallback) {
    try {
      return this.stompClient.subscribe(topic, receiverCallback);
    } catch (e) {
      this.logger.error(e);
    }
  }

  public isConnected(): boolean {
    return (this.session !== null);
  }

  private createStompClient() {
    this.logger.debug('Starting Websocket Connection');
    const ws = new SockJS(environment.ws);
    this.logger.debug('Convert to Stomp Connection');
    this.stompClient = Stomp.over(ws);
    if (!environment.debugSocket) {
      this.stompClient.debug = null;
    }
  }

  sendMessage(destination: string, serializable: any) {
    const headers = {
      'Content-Type': 'APPLICATION/JSON'
    };
    this.stompClient.send(destination, headers, JSON.stringify(serializable));
  }
}
