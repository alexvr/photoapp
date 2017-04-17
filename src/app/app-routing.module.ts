import {NgModule}               from '@angular/core';
import {RouterModule, Routes}   from '@angular/router';
import {OnlineEventOverviewComponent} from './online-event-overview/online-event-overview.component';
import {StartScreenComponent} from "./start-screen/start-screen.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {EventScreenComponent} from "./event/event-screen.component";

export const routes: Routes = [
  {path: 'online-event-overview', component: OnlineEventOverviewComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'event', component: EventScreenComponent},
  {path: '', component: StartScreenComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
