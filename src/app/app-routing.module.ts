import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {CanAuthenticationGuard} from './guard/keycloak.guard';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [CanAuthenticationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
