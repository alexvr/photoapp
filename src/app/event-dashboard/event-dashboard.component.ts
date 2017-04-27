import {Component} from "@angular/core";
import {ServerService} from "./services/server.service";
@Component({
  selector: 'event-dashboard',
  templateUrl: 'event-dashboard.component.html',
  styleUrls: ['event-dashboard.component.css']
})

export class EventDashboardComponent {

  constructor(private serverService: ServerService) {
    this.serverService.startServer();
  }

}
