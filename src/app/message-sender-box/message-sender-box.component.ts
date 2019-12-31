import {Component, OnDestroy, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {FormControl, FormGroup} from '@angular/forms';
import WebsocketService from '../services/websocket.service';
import ChatMessageDTO from '../dtos/chat.message.dto';
import UserDTO from '../dtos/user.dto';
import {DestinationSubjectsService} from '../services/common.subjects.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-message-sender-box',
  templateUrl: './message-sender-box.component.html',
  styleUrls: ['./message-sender-box.component.scss']
})
export class MessageSenderBoxComponent implements OnInit, OnDestroy {
  private sendMessageForm: FormGroup;
  private destinations: Subscription;
  private destination: UserDTO = new UserDTO();

  constructor(private logger: NGXLogger, private websocketService: WebsocketService,
              private destinationSubjectsService: DestinationSubjectsService<UserDTO>) {
  }

  ngOnInit() {
    const self = this;
    this.sendMessageForm = new FormGroup({
      textToSend: new FormControl('')
    });
    self.destinations = self.destinationSubjectsService.event.subscribe((user: UserDTO) => self.setDestination(user));
  }

  ngOnDestroy(): void {
    if (this.destinations) {
      this.destinations.unsubscribe();
    }
  }

  setDestination(user: UserDTO): void {
    this.destination = user;
  }

  sendEvent($event: Event) {
    $event.preventDefault();
    const dto = new ChatMessageDTO(this.sendMessageForm.value.textToSend, null, false, new Date());
    if (this.destination.subject) {
      dto.destination = this.destination.subject;
      dto.isPrivate = true;
    }
    this.websocketService.sendMessage('/app/messages', dto);
    this.sendMessageForm.reset();
  }

}
