import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import WebsocketService from '../services/websocket.service';
import {environment} from '../../environments/environment';
import {Subscription} from 'rxjs';
import ChatMessageDTO from '../dtos/chat.message.dto';
import {DestinationSubjectsService, SocketEventSubjectsService} from '../services/common.subjects.service';
import MessageResponseDTO from '../dtos/messageResponseDTO';
import UserDTO from '../dtos/user.dto';
import {SocketEvent, SocketEventDTO} from '../dtos/socket.event.dto';
import {ChatKeyCloakService} from '../services/keycloak.service';
import {KeyCloakUser} from '../dtos/keycloak.dto';

@Component({
  selector: 'app-message-reader',
  templateUrl: './message-reader.component.html',
  styleUrls: ['./message-reader.component.scss']
})
export class MessageReaderComponent implements OnInit, OnDestroy, AfterViewInit {
  private publicTopic: Subscription = null;
  @ViewChild('chatHistory', {static: false}) chatHistory: ElementRef;
  public messages: ChatMessageDTO[] = [];
  public isDivToBottomForce = true;
  public name = null;
  private socketEvents: Subscription;
  public user: KeyCloakUser;
  private privateTopic: Subscription;


  constructor(private logger: NGXLogger,
              private socketEventSubjectsService: SocketEventSubjectsService<SocketEventDTO>,
              private destinationSubjectsService: DestinationSubjectsService<UserDTO>,
              private webSocketService: WebsocketService,
              private chatKeyCloakService: ChatKeyCloakService) {
  }

  ngAfterViewInit() {
    this.forceToBottom();
  }

  private forceToBottom(): void {
    if (this.isDivToBottomForce) {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    }
  }

  ngOnInit() {
    this.subscribes();
    this.loadUsers();
  }

  private subscribes(): void {
    const self = this;
    self.socketEvents = self.socketEventSubjectsService.event.subscribe(((startEvent: SocketEventDTO) => self.sendEvents(startEvent)));
  }

  sendEvents(socketEvent: SocketEventDTO): void {
    const self = this;
    if (socketEvent.event === SocketEvent.START) {
      this.subscribeAll();
    }
    if (socketEvent.event === SocketEvent.STOP) {
      this.unsubscribeAll();
    }
  }

  private subscribeAll() {
    const self = this;
    this.publicTopic = this.webSocketService.subscribe(environment.topics.publicChat,
      (res: MessageResponseDTO) => self.publicReceiver(res));
    this.logger.debug('Public Topics subscribed');

    this.privateTopic = this.webSocketService.subscribe(environment.topics.privateChat,
      (res: MessageResponseDTO) => self.publicReceiver(res));
    this.logger.debug('Private Topics subscribed');
  }

  publicReceiver(messageResponseDTO: MessageResponseDTO) {
    const messageDto = this.getChatMessageDTO(messageResponseDTO);
    this.addMessage(messageDto);
  }

  addMessage(chatMessageDTO: ChatMessageDTO) {
    this.logger.debug(chatMessageDTO);
    this.messages.push(chatMessageDTO);
    this.rotateMessages();
    this.forceToBottom();
  }

  private rotateMessages(): void {
    if (this.messages.length > environment.maxMessages) {
      const diff = this.messages.length - environment.maxMessages;
      this.messages.splice(0, diff);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    if (this.publicTopic) {
      this.publicTopic.unsubscribe();
    }
    if (this.socketEvents) {
      this.socketEvents.unsubscribe();
    }
    if (this.privateTopic) {
      this.privateTopic.unsubscribe();
    }
  }

  private loadUsers() {
    const self = this;
    this.chatKeyCloakService.getLogged((user: KeyCloakUser) => {
      self.user = user;
    });
  }

  public setDestination(message: ChatMessageDTO) {
    this.chatKeyCloakService.getLogged((user: KeyCloakUser) => {
      if (message.subject === user.sub) {
        return;
      }
      const userDTO = new UserDTO();
      userDTO.subject = message.subject;
      userDTO.name = message.sender;
      this.destinationSubjectsService.dispathEvent(userDTO);
    });

  }

  private getChatMessageDTO(messageResponseDTO: MessageResponseDTO) {
    return JSON.parse(messageResponseDTO.body);
  }
}
