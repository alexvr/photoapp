// Modules
import {BrowserModule}    from '@angular/platform-browser';
import {NgModule}         from '@angular/core';
import {FormsModule}      from '@angular/forms';
import {HttpModule}       from '@angular/http';
import {AppRoutingModule} from "./app-routing.module";
import {SwiperModule}     from "angular2-useful-swiper";
import {SpinnerModule}    from 'angular2-spinner/dist';

// Services
import {AuthService}          from "./login/services/auth.service";
import {PrinterService}       from "./configuration/services/printer.service";
import {EventDetailComponent} from "./event/event-detail/event-detail.component";
import {QrCodeService}        from "./event/services/qr-code.service";
import {ServerService}        from "./event-dashboard/services/server.service";
import {ConfigurationService} from "./configuration/services/configuration.service";
import {TestEventService}     from "./event/services/test-event.service";
import {WatermarkConfigService} from "./configuration/services/watermark-config.service";
import {EventService} from "./event/services/event.service";
import {LayoutService} from "./configuration/services/layout.service";
import {AuthHttpImpl} from "./login/services/auth-http-impl";

// Components
import {AppComponent}            from './app.component';
import {EventOverviewComponent}  from "./event/event-overview/event-overview.component";
import {StartScreenComponent}    from "./start-screen/start-screen.component";
import {EventIconComponent}      from "./start-screen/event-icon/event-icon.component";
import {LoginComponent}          from "./login/login.component";
import {ConfigurationComponent}  from "./configuration/configuration.component";
import {BasicInfoComponent}      from "./configuration/basic-info/basic-info.component";
import {MediaSettingsComponent}  from "./configuration/media-settings/media-settings.component";
import {LayoutSettingsComponent} from "./configuration/layout-settings/layout-settings.component";
import {SharePageComponent} from "./configuration/share-page/share-page.component";
import {EventDashboardComponent} from "./event-dashboard/event-dashboard.component";
import {WatermarkConfigComponent} from "./configuration/media-settings/watermark-config/watermark-config.component";
import {OverviewLayoutChooserComponent} from "./configuration/layout-settings/overview-layout-chooser/overview-layout-chooser.component";
import {DetailLayoutChooserComponent} from "./configuration/layout-settings/detail-layout-chooser/detail-layout-chooser.component";
import {OverviewLayoutConfigComponent} from "./configuration/layout-settings/overview-layout-config/overview-layout-config.component";
import {DetailLayoutConfigComponent} from "./configuration/layout-settings/detail-layout-config/detail-layout-config.component";
import {DimensionsPipe} from "./configuration/media-settings/watermark-config/dimensions.pipe";

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    EventOverviewComponent,
    EventDetailComponent,
    EventIconComponent,
    LoginComponent,
    ConfigurationComponent,
    BasicInfoComponent,
    MediaSettingsComponent,
    LayoutSettingsComponent,
    SharePageComponent,
    EventDashboardComponent,
    WatermarkConfigComponent,
    OverviewLayoutChooserComponent,
    DetailLayoutChooserComponent,
    OverviewLayoutConfigComponent,
    DetailLayoutConfigComponent,
    DimensionsPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SwiperModule,
    SpinnerModule
  ],
  providers: [
    AuthService,
    PrinterService,
    QrCodeService,
    ServerService,
    ConfigurationService,
    EventService,
    TestEventService,
    WatermarkConfigService,
    LayoutService,
    AuthHttpImpl
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
