import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  // @ts-ignore
  return (): Promise<any> => keycloak.init(environment.keycloak);
}
