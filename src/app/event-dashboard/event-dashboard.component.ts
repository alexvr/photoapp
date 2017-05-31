import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ServerService} from './services/server.service';
import {EventService} from '../event/services/event.service';
import {Event} from '../model/Event';
import {PrinterService} from '../configuration/services/printer.service';
import {Subscription} from 'rxjs/Subscription';
import {TimerObservable} from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'event-dashboard',
  templateUrl: 'event-dashboard.component.html',
  styleUrls: ['event-dashboard.component.css']
})

export class EventDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('logcontainer') private logcontainer: ElementRef;

  private serverHost: number;
  private serverPort: number;
  private printer: string;
  private mediaFolder: string;
  private clientSubscriptions: Subscription;
  private disconnectedClients: Subscription;
  private connectedClients: any[] = [];
  private logSubscription: Subscription;
  private logs: string[] = [];
  private event: Event;

  private printCounter: number;
  private shareCounter: number;
  private photoSubscription: Subscription;
  private photoCounter = 0;
  private durationSubscription: Subscription;
  private eventDuration = '00:00:00';

  constructor(private serverService: ServerService,
              private eventService: EventService,
              private printerService: PrinterService,
              private zone: NgZone) {
    // Get the Event.
    this.event = this.eventService.getSelectedEvent();

    // Get printer information.
    this.printer = this.event.config.printerName;

    // Get media folder.
    this.mediaFolder = this.event.config.mediaStorage;

    // Start the server and retrieve information.
    const mediastorage = this.event.config.mediaStorage;
    const photoQuality = this.event.config.photoQuality.toString();
    const eventId = this.event.eventId;
    const eventName = this.event.eventName;
    const printer = this.event.config.printerName;
    const overviewLayout = this.event.overviewLayout;
    const detailLayout = this.event.detailLayout;
    const printWatermark = this.event.config.printWatermark;
    const useWatermark = this.event.config.watermarkPrinting;

    console.log('Event-dashboard - OverviewLayout:');
    console.log(JSON.stringify(overviewLayout, null, 2));
    console.log('Event-dashboard - DetailLayout:');
    console.log(JSON.stringify(detailLayout, null, 2));

    this.serverService.startServer(mediastorage, photoQuality, eventId, eventName, printer, overviewLayout, detailLayout, printWatermark, useWatermark).subscribe(host => this.serverHost = host);
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
        this.connectedClients = this.connectedClients.filter(item => item !== client);
      });
    });

    // Listen to application logs.
    this.logSubscription = this.serverService.receiveApplicationLogs().subscribe(log => {
      this.zone.run(() => {
        this.logs.push(log);
        this.scrollToBottom();
      });
    });

    this.photoSubscription = this.serverService.receivePhotoCount().subscribe((counter) => {
      this.zone.run(() => {
        this.photoCounter = counter;
      });
    });
  }

  ngOnInit(): void {
    // Start the timer.
    const timer = TimerObservable.create(2000, 1000);
    this.durationSubscription = timer.subscribe(t => {
      this.eventDuration = this.getSecondsAsDigitalClock(t);
    });
  }

  private getSecondsAsDigitalClock(inputSeconds: number): string {
    const sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);
    const hoursString = (hours < 10) ? '0' + hours : hours.toString();
    const minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    const secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  private scrollToBottom(): void {
    const element = this.logcontainer.nativeElement;
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }

  private sendTestPrint(): void {
    this.printerService.testPrintPhotoOnPrinterWithName(this.printer);
  }

  private stopServer(): void {
    // TODO: Zet de connectie met socket.io stop.
  }

  ngOnDestroy(): void {
    this.clientSubscriptions.unsubscribe();
    this.disconnectedClients.unsubscribe();
    this.logSubscription.unsubscribe();
    this.durationSubscription.unsubscribe();
  }

}
