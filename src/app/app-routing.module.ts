import { NgModule }               from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { OnlineEventOverviewComponent } from './online-event-overview/online-event-overview.component';
import {StartScreenComponent} from "./startscreen/startscreen.component";

export const routes: Routes = [
  {path: 'online-event-overview', component: OnlineEventOverviewComponent},
  {path: '', component: StartScreenComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
