import {NgModule}               from '@angular/core';
import {RouterModule, Routes}   from '@angular/router';
import {StartScreenComponent} from "./start-screen/start-screen.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {EventDashboardComponent} from "./event-dashboard/event-dashboard.component";
import {LoginComponent} from "./login/login.component";
import {BasicInfoComponent} from "./configuration/basic-info/basic-info.component";
import {LayoutSettingsComponent} from "./configuration/layout-settings/layout-settings.component";
import {MediaSettingsComponent} from "./configuration/media-settings/media-settings.component";
import {WatermarkConfigComponent} from "./configuration/media-settings/watermark-config/watermark-config.component";

export const routes: Routes = [
  {path: 'event-overview', component: StartScreenComponent},
  {
    path: 'configuration', component: ConfigurationComponent,
    children: [
      {path: '', redirectTo: 'basic-info', pathMatch: 'full'},
      {path: 'basic-info', component: BasicInfoComponent},
      {path: 'layout', component: LayoutSettingsComponent},
      {path: 'media-settings', component: MediaSettingsComponent},
      {path: 'watermark-config/:id', component: WatermarkConfigComponent},
    ]
  },
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
