import {Component, NgZone} from "@angular/core";
import {ServerService} from "./services/server.service";

@Component({
  selector: 'event-dashboard',
  templateUrl: 'event-dashboard.component.html',
  styleUrls: ['event-dashboard.component.css']
})

export class EventDashboardComponent {

  private serverHost: number;
  private serverPort: number;

  constructor(private serverService: ServerService, private zone: NgZone) {
    this.zone.run(() => {
      this.serverService.startServer().subscribe(host => this.serverHost = host);
      this.serverPort = 3001;
    });
  }

}
