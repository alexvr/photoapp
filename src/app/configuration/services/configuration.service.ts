import {Injectable} from "@angular/core";
import {PhotoQuality} from "../../model/PhotoQuality";
import {Event} from "../../model/Event";
import {Position} from "../../model/layout/Position";

@Injectable()
export class ConfigurationService {
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
      overviewLayout: {
        id: 0,
        logo: null,
        logoPosition: Position.CENTER,
        backgroundColor: '#efefef',
        backgroundImage: null,
        btnColor: null,
        btnImage: null,
        btnBorderColor: null,
        btnBorderWidth: 0,
        btnPressedColor: null,
        btnPressedImage: null,
        btnPressedBorderColor: null,
        imageBorderColor: null,
        imageBorderWidth: 0,
        imageContainer: false,
        imageContainerColor: null,
        imageContainerBorderColor: null,
        imageContainerBorderWidth: 0,
        selectionIcon: null,
        selectionContainer: false,
        selectionContainerColor: null,
        selectionContainerBorderColor: null,
        selectionContainerBorderWidth: 0,
        selectBtnText: 'select',
        navigationColor: null,
        activeNavigationColor: null,
      },
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
        printWatermark: null,
        webWatermark: null
      }
    };
  }

  getEvent() {
    return this.event;
  }

  saveEvent(event: Event) {
    this.event = event;
  }

}
