import { NgModule }               from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { LoginComponent }         from './login/login.component';
import { OnlineEventOverviewComponent } from './online-event-overview/online-event-overview.component';

export const routes: Routes = [
  {path: 'online-event-overview', component: OnlineEventOverviewComponent},
  {path: '', component: LoginComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
