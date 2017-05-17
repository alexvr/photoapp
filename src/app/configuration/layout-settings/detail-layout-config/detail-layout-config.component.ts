import {Component} from "@angular/core";
import {DetailLayout} from "../../../model/layout/DetailLayout";
import {Event} from "../../../model/Event";
import {LayoutService} from "../../services/layout.service";
import {ConfigurationService} from "../../services/configuration.service";
import {Image} from "../../../model/Image";

@Component({
  selector: 'detail-layout-config',
  templateUrl: 'detail-layout-config.component.html',
  styleUrls: ['detail-layout-config.component.css']
})

export class DetailLayoutConfigComponent {
  private event: Event;
  private detailLayout: DetailLayout;
  private isFullScreenPreview: boolean = false;
  private testImages: Image[] = [
    new Image(1, '../../../assets/images/photo.jpg'),
    new Image(2, '../../../assets/images/photo.jpg'),
    new Image(3, '../../../assets/images/photo.jpg')];

  constructor(public configurationService: ConfigurationService, public layoutService: LayoutService) {
    this.event = this.configurationService.getConfiguredEvent();
    this.detailLayout = this.event.detailLayout;
  }

  // IMAGE
  setActiveImagePositionClass(position) {
    if (position === this.detailLayout.imagePosition) {
      return 'btn btn-primary';
    } else {
      return 'btn btn-default';
    }
  }

  setImagePosition(position) {
    this.detailLayout.imagePosition = position;
  }

  // BUTTONS
  // Print button
  setPrintButton() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/detail-layout/printButton').subscribe(data => {
      this.detailLayout.printBtnImage = data;
    })
  }

  deletePrintButton() {
    this.detailLayout.printBtnImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/detail-layout/printButton');
  }

  // Share button
  setShareButton() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/detail-layout/shareButton').subscribe(data => {
      this.detailLayout.shareBtnImage = data;
    })
  }

  deleteShareButton() {
    this.detailLayout.shareBtnImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/detail-layout/shareButton');
  }

  // Back button
  setBackButton() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/detail-layout/backButton').subscribe(data => {
      this.detailLayout.backBtnImage = data;
    })
  }

  deleteBackButton() {
    this.detailLayout.backBtnImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/detail-layout/backButton');
  }

  // Finish button
  setFinishButton() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/detail-layout/finishButton').subscribe(data => {
      this.detailLayout.finishBtnImage = data;
    })
  }

  deleteFinishButton() {
    this.detailLayout.finishBtnImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/detail-layout/finishButton');
  }

  // PRINT-MESSAGE
  setPrintMessage() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/detail-layout/printMessage').subscribe(data => {
      this.detailLayout.printMessage = data;
    })
  }

  deletePrintMessage() {
    this.detailLayout.printImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/detail-layout/printMessage');
  }

  // BACKGROUND
  setBackgroundImage() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/detail-layout/background').subscribe(
      data => {
        this.detailLayout.backgroundImage = data;
      }
    )
  }

  deleteBackgroundImage() {
    this.detailLayout.backgroundImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/detail-layout/background');
  }

  // The styling of the background has to happen here, because it has to happen on the :host element
  setBackground(): any {
    if (this.detailLayout != null && this.detailLayout.backgroundImage) {
      return {'background-image': 'url(' + this.detailLayout.backgroundImage + ')', 'background-cover': 'cover'}
    } else {
      return {'background': this.detailLayout.backgroundColor};
    }
  }

  setFullScreen(fullScreen: boolean) {
    this.isFullScreenPreview = fullScreen;
  }
}
