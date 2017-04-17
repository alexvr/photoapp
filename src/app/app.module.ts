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
import { OnlineEventOverviewComponent } from "./online-event-overview/online-event-overview.component";

// Services
import { AuthService }    from "./login/auth.service";
import { LoginComponent } from "./login/login.component";

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    EventComponent
    OnlineEventOverviewComponent,
    LoginComponent
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
