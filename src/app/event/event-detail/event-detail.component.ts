import {Component, OnInit, Input} from "@angular/core";
import {QrCodeService} from "../services/qr-code.service";
import {DetailLayout} from "../../model/layout/DetailLayout";
import {Image} from "../../model/Image";

@Component({
  selector: 'event-detail',
  templateUrl: 'event-detail.component.html',
  styleUrls: ['event-detail.component.css']
})

export class EventDetailComponent implements OnInit {
  @Input() detailLayout: DetailLayout;
  @Input() isFullScreen: boolean;
  @Input() images: Image[];
  private selectedImage: Image;

  private config: Object = {
    slidesPerView: 3,
    spaceBetween: 5
  };

  constructor(private qrCodeService: QrCodeService) {

  }

  ngOnInit(): void {
    if (this.images.length > 0) {
      this.selectedImage = this.images[0];
    }
    this.qrCodeService.getQrCode().subscribe(x => console.log(x));

  }

  /**
   *  Show the menu on 3 clicks in left corner and 1 in the right corner.
   */
  private exitCounter = 0;
  private timer;
  private visibleAnimate: boolean = false;  // necessary for activating bootstrap modal in Typescript code.
  private visible: boolean = false;         // necessary for activating bootstrap modal in Typescript code.

  showMenuLeftBtn() {
    this.exitCounter++;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.exitCounter = 0, 3000);
  }

  showMenuRightBtn() {
    if (this.exitCounter >= 3) {
      this.visibleAnimate = true;
      this.visible = true;
    }
  }

  closeMenu() {
    this.visibleAnimate = false;
    this.visible = false;
  }

  /**
   * Functions to customize the layout style.
   */

  setImageStyle(): any {
    if (this.detailLayout != null) {
      return {
        'border': this.detailLayout.imageBorderWidth + 'px solid ' + this.detailLayout.imageBorderColor
      }
    } else {
      return {'border': 'none'}
    }
  }

  setPrintButton(): any {
    if (this.detailLayout != null && this.detailLayout.printBtnImage == null) {
      return {
        'background': this.detailLayout.printBtnColor,
        'border': this.detailLayout.printBtnBorderWidth + 'px solid ' + this.detailLayout.printBtnBorderColor,
        'color': this.detailLayout.printBtnBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setShareButton(): any {
    if (this.detailLayout != null && this.detailLayout.shareBtnImage == null) {
      return {
        'background': this.detailLayout.shareBtnColor,
        'border': this.detailLayout.shareBtnBorderWidth + 'px solid ' + this.detailLayout.shareBtnBorderColor,
        'color': this.detailLayout.shareBtnBorderColor

      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setBackButton(): any {
    if (this.detailLayout != null && this.detailLayout.backBtnImage == null) {
      return {
        'background': this.detailLayout.backBtnColor,
        'border': this.detailLayout.backBtnBorderWidth + 'px solid ' + this.detailLayout.backBtnBorderColor,
        'color': this.detailLayout.backBtnBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setFinishButton(): any {
    if (this.detailLayout != null && this.detailLayout.finishBtnImage == null) {
      return {
        'background': this.detailLayout.finishBtnColor,
        'border': this.detailLayout.finishBtnBorderWidth + 'px solid ' + this.detailLayout.finishBtnBorderColor,
        'color': this.detailLayout.finishBtnBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setPrintMessage(): any {
    if (this.detailLayout != null && this.detailLayout.printMessageImage == null) {
      return {
        'background': this.detailLayout.printMessageColor,
        'border': this.detailLayout.printMessageBorderWidth + 'px solid ' + this.detailLayout.printMessageBorderColor,
        'color': this.detailLayout.printMessageBorderColor
      }
    } else {
      return {'background': 'none', 'border': 'none'}
    }
  }

  setImagePosition(): any {
    if (this.detailLayout.imagePosition == 0) {
      return {'flex-direction': 'row'};
    } else {
      return {'flex-direction': 'row-reverse'};
    }
  }

  /**
   * select image
   */
  selectImage(img: Image) {
    this.selectedImage = img;
    console.log(this.selectedImage.imageNumber);
  }
}
