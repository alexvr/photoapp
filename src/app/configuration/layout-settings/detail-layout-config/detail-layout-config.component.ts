import {Component} from "@angular/core";
import {DetailLayout} from "../../../model/layout/DetailLayout";
import {Event} from "../../../model/Event";
import {LayoutService} from "../../services/layout.service";
import {ConfigurationService} from "../../services/configuration.service";

@Component({
  selector: 'detail-layout-config',
  templateUrl: 'detail-layout-config.component.html',
  styleUrls: ['detail-layout-config.component.css']
})

export class DetailLayoutConfigComponent {
  private event: Event;
  private detailLayout: DetailLayout;
  private fullSizePreview: boolean = false;

  constructor(public configurationService: ConfigurationService, public layoutService: LayoutService) {
    this.event = this.configurationService.getConfiguredEvent();
    this.detailLayout = this.event.detailLayout;
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

  // Background
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

  setFullSize(fullsize: boolean) {
    this.fullSizePreview = fullsize;
  }
}
