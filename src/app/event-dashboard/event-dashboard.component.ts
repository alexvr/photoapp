import {Component, NgZone} from '@angular/core';
import {ServerService} from './services/server.service';
import {EventService} from '../event/services/event.service';
import {Event} from '../model/Event';
import {PrinterService} from '../configuration/services/printer.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'event-dashboard',
  templateUrl: 'event-dashboard.component.html',
  styleUrls: ['event-dashboard.component.css']
})

export class EventDashboardComponent {

  private serverHost: number;
  private serverPort: number;
  private printer: string;
  private printerState: string;
  private clientSubscriptions: Subscription;
  private disconnectedClients: Subscription;
  private connectedClients: any[] = [];
  private event: Event;

  constructor(private serverService: ServerService,
              private eventService: EventService,
              private printerService: PrinterService,
              private zone: NgZone) {
    // Get the Event.
    this.event = this.eventService.getSelectedEvent();

    // Get printer information.
    this.printer = this.event.config.printerName;
    this.printerState = 'Active';

    // Start the server and retrieve information.
    this.serverService.startServer(this.event.config.mediaStorage).subscribe(host => this.serverHost = host);
    this.serverPort = 3001;

    // Get the IP addresses of all connected clients and display them.
    this.clientSubscriptions = this.serverService.receiveConnectedClients().subscribe(client => {
      this.zone.run(() => {
        this.connectedClients.push(client);
      });
    });

    // Listen to disconnected clients.
    this.disconnectedClients = this.serverService.receiveDisconnectedClients().subscribe(client => {
      this.zone.run(() => {
        this.connectedClients.push(client);
        this.connectedClients = this.connectedClients.filter(item => item !== client);
      });
    });
  }

  private sendTestPrint(): void {
    this.printerService.testPrintPhotoOnPrinterWithName(this.printer);
  }

  private stopServer(): void {
    // Zet de connectie met socket.io stop.
  }

}
