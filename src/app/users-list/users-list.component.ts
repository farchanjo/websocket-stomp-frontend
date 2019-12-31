import {Component, OnDestroy, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {DestinationSubjectsService, SocketEventSubjectsService} from '../services/common.subjects.service';
import WebsocketService from '../services/websocket.service';
import {Subscription} from 'rxjs';
import {environment} from '../../environments/environment';
import MessageResponseDTO from '../dtos/messageResponseDTO';
import TotalUsersMessageDTO from '../dtos/total.users.message.dto';
import UserDTO from '../dtos/user.dto';
import {ChatKeyCloakService} from '../services/keycloak.service';
import {SocketEvent, SocketEventDTO} from '../dtos/socket.event.dto';
import {KeyCloakUser} from '../dtos/keycloak.dto';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  public socketEvents: Subscription;
  public users: UserDTO[] = [];
  public total = 0;
  public userSelected: UserDTO = null;
  private destinations: Subscription;

  constructor(private logger: NGXLogger,
              private socketEventSubjectsService: SocketEventSubjectsService<SocketEventDTO>,
              private webSocketService: WebsocketService,
              private destinationSubjectsService: DestinationSubjectsService<UserDTO>,
              private chatKeyCloakService: ChatKeyCloakService) {
  }

  ngOnInit() {
    this.subscribes();
  }

  ngOnDestroy(): void {
    if (this.socketEvents) {
      this.socketEvents.unsubscribe();
    }
    if (this.destinations) {
      this.destinations.unsubscribe();
    }
  }

  private subscribes(): void {
    const self = this;
    self.socketEvents = self.socketEventSubjectsService.event
      .subscribe(((socketEvent: SocketEventDTO) => self.sendEvents(socketEvent)));
    this.logger.debug('Socket Event subscribed');
    self.destinations = self.destinationSubjectsService.event.subscribe((res: UserDTO) => self.setDestination(res));
    this.logger.debug('Destination Event subscribed');
  }

  sendEvents(socketEvent: SocketEventDTO): void {
    if (socketEvent.event === SocketEvent.START) {
      this.webSocketService.subscribe(environment.topics.showUsers,
        (res: MessageResponseDTO) => this.handleReceiverCounter(res));
      this.logger.debug('Total Users Topics subscribed');
    }
  }

  handleReceiverCounter(messageResponseDTO: MessageResponseDTO) {
    const totalUsers = this.getTotalUsersMessageDTO(messageResponseDTO);
    this.loadBinds(totalUsers);
  }

  private getTotalUsersMessageDTO(messageResponseDTO: MessageResponseDTO): TotalUsersMessageDTO {
    return JSON.parse(messageResponseDTO.body);
  }

  private loadBinds(totalUsersMessageDTO: TotalUsersMessageDTO) {
    const self = this;
    this.chatKeyCloakService.getLogged((cloakUser: KeyCloakUser) => {
      self.users = totalUsersMessageDTO.users.filter(user => user.subject !== cloakUser.sub);
      self.total = totalUsersMessageDTO.total;
    });
  }

  private setDestination(user: UserDTO) {
    this.userSelected = user;
  }

  setDestinationByEvent(user: UserDTO) {
    this.destinationSubjectsService.dispathEvent(user);
  }

  removeSelectedByEvent(userSelected: UserDTO) {
    this.destinationSubjectsService.dispathEvent(new UserDTO());
  }
}
