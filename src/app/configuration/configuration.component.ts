import {Component} from "@angular/core";
import {Event} from "../model/Event";
import {PhotoQuality} from "../model/PhotoQuality";
@Component({
  selector: 'configuration',
  templateUrl: 'configuration.component.html',
  styleUrls: ['configuration.component.css']
})

export class ConfigurationComponent {
  private activePart: number = 1;
  private event: Event;

  constructor() {
    this.event = {
      eventName: 'Chaumet',
      eventStartDate: null,
      eventEndDate: null,
      eventLocation: null,
      eventAddress: null,
      company: null,
      companyAddress: null,
      contact: null,
      contactPhone: null,
      overviewLayout: null,
      detailLayout: null,
      configuration: {
        mediastorage: null,
        photoQuality: PhotoQuality.HIGH,
        ftpIPAddress: null,
        ftpPort: 22,
        ftpUsername: 'testuser',
        ftpPassword: '1234',
        printerName: null,
        printingEnabled: null,
        automaticPrinting: null,
        printerCopies: null,
        watermarkPrinting: null,
        watermarkImage: null,
        qrPrinting: null,
      }
    }
  }

  /*
  * Changes the visible component.
  * 1 = basic-info, 2 = media-settings, 3 = layout-settings
  * */
  changeActivePart(newActivePart: number) {
    this.activePart = newActivePart;
  }

}
