import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartScreenComponent} from './start-screen/start-screen.component';
import {ConfigurationComponent} from './configuration/configuration.component';
import {EventDashboardComponent} from './event-dashboard/event-dashboard.component';
import {LoginComponent} from './login/login.component';
import {BasicInfoComponent} from './configuration/basic-info/basic-info.component';
import {LayoutSettingsComponent} from './configuration/layout-settings/layout-settings.component';
import {MediaSettingsComponent} from './configuration/media-settings/media-settings.component';
import {WatermarkConfigComponent} from './configuration/media-settings/watermark-config/watermark-config.component';
import {OverviewLayoutChooserComponent} from './configuration/layout-settings/overview-layout-chooser/overview-layout-chooser.component';
import {DetailLayoutChooserComponent} from './configuration/layout-settings/detail-layout-chooser/detail-layout-chooser.component';
import {DetailLayoutConfigComponent} from './configuration/layout-settings/detail-layout-config/detail-layout-config.component';
import {OverviewLayoutConfigComponent} from './configuration/layout-settings/overview-layout-config/overview-layout-config.component';
import {EventOverviewComponent} from "./event/event-overview/event-overview.component";

export const routes: Routes = [
  /*{path: '', component: LoginComponent},
  {path: 'start-screen', component: StartScreenComponent},
  {
    path: 'configuration', component: ConfigurationComponent,
    children: [
      {path: '', redirectTo: 'basic-info', pathMatch: 'full'},
      {path: 'basic-info', component: BasicInfoComponent},
      {
        path: 'layout', component: LayoutSettingsComponent,
        children: [
          {path: '', redirectTo: 'overview-layout-chooser', pathMatch: 'full'},
          {path: 'overview-layout-chooser', component: OverviewLayoutChooserComponent},
          {path: 'detail-layout-chooser', component: DetailLayoutChooserComponent},
          {path: 'detail-layout-config', component: DetailLayoutConfigComponent},
          {path: 'overview-layout-config', component: OverviewLayoutConfigComponent},
        ]
      },
      {path: 'media-settings', component: MediaSettingsComponent},
      {path: 'watermark-config/:id', component: WatermarkConfigComponent},
    ]
  },
  {path: 'temp-event-overview', component: EventOverviewComponent},
  {path: 'event-dashboard', component: EventDashboardComponent},
  {path: '**', redirectTo: ''}*/

  {path: 'fdqs', component: LoginComponent},
  {path: '', component: StartScreenComponent},
  {
    path: 'configuration', component: ConfigurationComponent,
    children: [
      {path: '', redirectTo: 'basic-info', pathMatch: 'full'},
      {path: 'basic-info', component: BasicInfoComponent},
      {
        path: 'layout', component: LayoutSettingsComponent,
        children: [
          {path: '', redirectTo: 'overview-layout-chooser', pathMatch: 'full'},
          {path: 'overview-layout-chooser', component: OverviewLayoutChooserComponent},
          {path: 'detail-layout-chooser', component: DetailLayoutChooserComponent},
          {path: 'detail-layout-config', component: DetailLayoutConfigComponent},
          {path: 'overview-layout-config', component: OverviewLayoutConfigComponent},
        ]
      },
      {path: 'media-settings', component: MediaSettingsComponent},
      {path: 'watermark-config/:id', component: WatermarkConfigComponent},
    ]
  },
  {path: 'event-dashboard', component: EventDashboardComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
