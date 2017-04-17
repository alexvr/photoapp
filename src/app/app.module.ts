// Modules
import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';
import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent }           from './app.component';
import {EventComponent} from "./startscreen/event/event.component";
import {StartScreenComponent} from "./startscreen/startscreen.component";
import { LoginComponent } from "./login/login.component";
import { OnlineEventOverviewComponent } from "./online-event-overview/online-event-overview.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {BasicInfoComponent} from "./configuration/basic-info/basic-info.component";
import {MediaSettingsComponent} from "./configuration/media-settings/media-settings.component";
import {LayoutSettingsComponent} from "./configuration/layout-settings/layout-settings.component";

// Services
import { AuthService }    from "./login/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    EventComponent,
    OnlineEventOverviewComponent,
    LoginComponent,
    ConfigurationComponent,
    BasicInfoComponent,
    MediaSettingsComponent,
    LayoutSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
