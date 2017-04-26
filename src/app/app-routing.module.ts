import {NgModule}               from '@angular/core';
import {RouterModule, Routes}   from '@angular/router';
import {StartScreenComponent} from "./start-screen/start-screen.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {EventDashboardComponent} from "./event-dashboard/event-dashboard.component";
import {LoginComponent} from "./login/login.component";

export const routes: Routes = [
  {path: 'event-overview', component: StartScreenComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'event-dashboard', component: EventDashboardComponent},
  {path: '', component: LoginComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
