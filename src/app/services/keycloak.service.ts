import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {KeycloakService} from 'keycloak-angular';
import {KeyCloakUser} from '../dtos/keycloak.dto';

@Injectable({
  providedIn: 'root',
})
export class ChatKeyCloakService {
  constructor(private logger: NGXLogger,
              private keycloakService: KeycloakService) {
  }

  public getLogged(callback) {
    const subject = localStorage.getItem('subject');
    if (subject) {
      callback(JSON.parse(subject));
      return;
    }
    this.keycloakService.getKeycloakInstance()
      .loadUserInfo().success((result: KeyCloakUser) => {
      localStorage.setItem('subject', JSON.stringify(result));
      callback(result);
    });
  }
}
