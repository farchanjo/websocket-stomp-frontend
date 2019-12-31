import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {LoggerModule} from 'ngx-logger';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MessageReaderComponent} from './message-reader/message-reader.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCommonModule} from '@angular/material/core';
import {MessageSenderBoxComponent} from './message-sender-box/message-sender-box.component';
import {UsersListComponent} from './users-list/users-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {initializer} from './services/keycloak.initializer.service';

@NgModule({
  declarations: [
    AppComponent,
    MessageReaderComponent,
    MessageSenderBoxComponent,
    UsersListComponent
  ],
  imports: [
    BrowserModule,
    LoggerModule.forRoot(environment.log),
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCommonModule,
    MatInputModule,
    KeycloakAngularModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializer,
    multi: true,
    deps: [KeycloakService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
