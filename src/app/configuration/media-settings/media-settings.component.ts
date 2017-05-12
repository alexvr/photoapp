import {Component, NgZone, OnInit} from '@angular/core';
import {Event} from '../../model/Event';
import {PhotoQuality} from '../../model/PhotoQuality';
import {PrinterService} from '../services/printer.service';
import {ConfigurationService} from '../services/configuration.service';

@Component({
  selector: 'media-settings',
  templateUrl: 'media-settings.component.html',
  styleUrls: ['media-settings.component.css']
})

export class MediaSettingsComponent implements OnInit {

  public event: Event;
  private printers: string[];

  constructor(public configService: ConfigurationService, public printerService: PrinterService, public zone: NgZone) {
  }

  ngOnInit(): void {
    this.event = this.configService.getConfiguredEvent();
    this.setPhotoQualityEvent(this.event.config.photoQuality);
    this.printerService.getAllPrinters().subscribe(p => this.printers = p);
  }

  public setPhotoQualityEvent(quality: any): void {
    switch (quality) {
      case 'LOW' || PhotoQuality.LOW:
        this.event.config.photoQuality = PhotoQuality.LOW;
        this.setPhotoQuality(0);
        break;
      case 'MEDIUM' || PhotoQuality.MEDIUM:
        this.event.config.photoQuality = PhotoQuality.MEDIUM;
        this.setPhotoQuality(1);
        break;
      case 'HIGH' || PhotoQuality.HIGH:
        this.event.config.photoQuality = PhotoQuality.HIGH;
        this.setPhotoQuality(2);
        break;
    }
  }

  public setPhotoQuality(x: number) {
    switch (x) {
      case 0:
        this.event.config.photoQuality = PhotoQuality.LOW;
        break;
      case 1:
        this.event.config.photoQuality = PhotoQuality.MEDIUM;
        break;
      case 2:
        this.event.config.photoQuality = PhotoQuality.HIGH;
        break;
    }
  }

  public setPhotoQualityButtonStyle(x: number) {
    if (this.event.config.photoQuality != null && x === this.event.config.photoQuality) {
      return {
        'background': '#2880d0',
        'border-color': '#245988',
        'color': '#fff',
      };
    } else {
      return {
        'background': '#fff',
        'border-color': '#ccc',
        'color': '#333',
      };
    }
  }

  public toggleQrPrinting(choice: boolean): void {
    this.event.config.qrPrinting = choice;
  }

  private toggleWatermarkPrinting(choice: boolean): void {
    this.event.config.watermarkPrinting = choice;
  }

  private toggleWatermarkSharing(choice: boolean): void {
    this.event.config.watermarkSharing = choice;
  }

  public setMediaStoragePath(): void {
    this.configService.getDirectoryPath().subscribe((path) => {
      this.zone.run(() => {
        this.event.config.mediaStorage = path;
      });
    });
  }

  public setQrPath(): void {
    this.configService.getFilePath().subscribe((path) => {
      this.zone.run(() => {
        this.event.config.qrImage = path;
      });
    });
  }

}
