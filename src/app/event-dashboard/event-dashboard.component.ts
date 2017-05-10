import {Component} from '@angular/core';
import {ServerService} from './services/server.service';
import {EventService} from '../event/services/event.service';
import {Event} from '../model/Event';
import {PrinterService} from '../configuration/services/printer.service';

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
  private event: Event;

  constructor(private serverService: ServerService, private eventService: EventService, private printerService: PrinterService) {
    // Get the Event.
    this.event = this.eventService.getSelectedEvent();

    // Get printer information.
    this.printer = this.event.config.printerName;
    this.printerState = 'Active';

    // Start the server and retrieve information.
    this.serverService.startServer().subscribe(host => this.serverHost = host);
    this.serverPort = 3001;
  }

  private sendTestPrint(): void {
    this.printerService.testPrintPhotoOnPrinterWithName(this.printer);
  }

}
