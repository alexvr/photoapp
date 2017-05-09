import {Component, OnInit} from '@angular/core';
import {Configuration} from '../../model/Configuration';
import {PhotoQuality} from '../../model/PhotoQuality';
import {PrinterService} from '../services/printer.service';
import {ConfigurationService} from '../services/configuration.service';

@Component({
  selector: 'media-settings',
  templateUrl: 'media-settings.component.html',
  styleUrls: ['media-settings.component.css']
})

export class MediaSettingsComponent implements OnInit {

  private configuration: Configuration;
  private printers: string[];

  constructor(private configService: ConfigurationService, private printerService: PrinterService) {
  }

  ngOnInit(): void {
    this.configuration = this.configService.getEvent().config;
    this.printerService.getAllPrinters().subscribe(p => this.printers = p);
  }

  setPhotoQuality(x: number) {
    switch (x) {
      case 0:
        this.configuration.photoQuality = PhotoQuality.LOW;
        break;
      case 1:
        this.configuration.photoQuality = PhotoQuality.MEDIUM;
        break;
      case 2:
        this.configuration.photoQuality = PhotoQuality.HIGH;
        break;
    }
  }

  setPhotoQualityButtonStyle(x: number) {
    if (this.configuration.photoQuality != null && x == this.configuration.photoQuality) {
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
}
