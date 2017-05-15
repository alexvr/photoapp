import {Component, OnInit, Input} from "@angular/core";
import {QrCodeService} from "../services/qr-code.service";
import {DetailLayout} from "../../model/layout/DetailLayout";
@Component({
  selector: 'event-detail',
  templateUrl: 'event-detail.component.html',
  styleUrls: ['event-detail.component.css']
})

export class EventDetailComponent implements OnInit {
  @Input() detailLayout: DetailLayout;

  constructor(private qrCodeService: QrCodeService) {

  }

  ngOnInit(): void {
    this.qrCodeService.getQrCode().subscribe(x => console.log(x));
  }

  setPrintButton(): any {
    if (this.detailLayout != null && this.detailLayout.printBtnImage == null) {
      return {
        'background': this.detailLayout.printBtnColor,
        'border': this.detailLayout.printBtnBorderWidth + 'px solid ' + this.detailLayout.printBtnBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setShareButton(): any {
    if (this.detailLayout != null && this.detailLayout.shareBtnImage == null) {
      return {
        'background': this.detailLayout.shareBtnColor,
        'border': this.detailLayout.shareBtnBorderWidth + 'px solid ' + this.detailLayout.shareBtnBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setBackButton(): any {
    if (this.detailLayout != null && this.detailLayout.backBtnImage == null) {
      return {
        'background': this.detailLayout.backBtnColor,
        'border': this.detailLayout.backBtnBorderWidth + 'px solid ' + this.detailLayout.backBtnBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setFinishButton(): any {
    if (this.detailLayout != null && this.detailLayout.finishBtnImage == null) {
      return {
        'background': this.detailLayout.finishBtnColor,
        'border': this.detailLayout.finishBtnBorderWidth + 'px solid ' + this.detailLayout.finishBtnBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }
}
