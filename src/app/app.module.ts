// Modules
import {BrowserModule}    from '@angular/platform-browser';
import {NgModule}         from '@angular/core';
import {FormsModule}      from '@angular/forms';
import {HttpModule}       from '@angular/http';
import {AppRoutingModule} from "./app-routing.module";
import {SwiperModule} from "angular2-useful-swiper";

// Components
import {AppComponent}           from './app.component';
import {EventScreenComponent} from "./event/event-screen.component";
import {StartScreenComponent} from "./start-screen/start-screen.component";
import {EventIconComponent} from "./start-screen/event-icon/event-icon.component";
import {LoginComponent} from "./login/login.component";
import {OnlineEventOverviewComponent} from "./online-event-overview/online-event-overview.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {BasicInfoComponent} from "./configuration/basic-info/basic-info.component";
import {MediaSettingsComponent} from "./configuration/media-settings/media-settings.component";
import {LayoutSettingsComponent} from "./configuration/layout-settings/layout-settings.component";

// Services
import {AuthService}    from "./login/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    EventScreenComponent,
    EventIconComponent,
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
    AppRoutingModule,
    SwiperModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
