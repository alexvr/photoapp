import {Component, NgZone} from "@angular/core";
import {Event} from "../model/Event";
import {ServerService}     from "./services/server.service";
import {TestEventService}  from "../event/services/test-event.service";

@Component({
  selector: 'event-dashboard',
  templateUrl: 'event-dashboard.component.html',
  styleUrls: ['event-dashboard.component.css']
})

export class EventDashboardComponent {

  private serverHost: number;
  private serverPort: number;
  private event: Event;

  constructor(private serverService: ServerService,
              private testEventService: TestEventService,
              private zone: NgZone) {
    this.zone.run(() => {
      // Get the event.
      this.testEventService.getEventByName('Chaumet').subscribe(e => this.event = e);

      // Start the server.
      this.serverService.startServer().subscribe(host => this.serverHost = host);
      this.serverPort = 3001;
    });
  }

  /**
   * Send the layout to the clients.
   */
  sendLayout(): void {
    this.testEventService.sendLayout(this.event.overviewLayout, this.event.detailLayout).subscribe(() => { });
  }

}
