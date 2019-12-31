import {Component, OnDestroy, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import WebsocketService from './services/websocket.service';
import {NGXLogger} from 'ngx-logger';
import {SocketEventSubjectsService} from './services/common.subjects.service';
import {SocketEvent, SocketEventDTO} from './dtos/socket.event.dto';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'keycloak-websocket';
  private observer: any = null;

  constructor(private keycloakService: KeycloakService,
              private logger: NGXLogger,
              private startSubjectsService: SocketEventSubjectsService<SocketEventDTO>,
              private webSocketService: WebsocketService) {
  }

  ngOnInit() {
    this.logger.debug('AppComponent Created');
    const self = this;
    this.keycloakService.getToken()
      .then(token => self.startWebsocket(token));
  }

  startWebsocket(token: string) {
    const self = this;
    this.webSocketService.connect(token, res => self.sendEventStart(res));
  }

  sendEventStart(res: any) {
    this.startSubjectsService.dispathEvent(new SocketEventDTO(SocketEvent.START, `Socket has been connected: ${res}`));
  }

  ngOnDestroy(): void {
    this.logger.debug('AppComponent Destroyed');
    if (this.observer) {
      this.observer.unsubscribe();
    }
  }
}
