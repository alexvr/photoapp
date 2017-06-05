import {Component, OnInit, Input} from '@angular/core';
import {DetailLayout} from '../../model/layout/DetailLayout';
import {Image} from '../../model/Image';

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

  private isPrinted = false;

  private qrCode: string;

  private config: Object = {
    slidesPerView: 3,
    spaceBetween: 5
  };

  constructor() {

  }

  ngOnInit(): void {
    if (this.images.length > 0) {
      this.selectedImage = this.images[0];
    }
  }

  /**
   * Functions to customize the layout style.
   */

  private setSelectedImageStyle(): any {
    if (this.isFullScreen) {
      return {
        'padding': '0'
      };
    } else {
      return {
        'padding': '10px 0'
      };
    }
  }

  private setImageStyle(): any {
    if (this.detailLayout != null && !this.isFullScreen) {
      return {
        'border': this.detailLayout.imageBorderWidth + 'px solid ' + this.detailLayout.imageBorderColor,
        'max-width': '35%',
        'padding-top': '7px'
      };
    } else if (this.detailLayout != null && this.isFullScreen) {
      return {
        'border': this.detailLayout.imageBorderWidth + 'px solid ' + this.detailLayout.imageBorderColor,
        'max-width': '70%'
      };
    } else {
      return {'border': 'none'};
    }
  }

  private setImageActions(): any {
    if (this.isFullScreen) {
      return {
        'padding': '65px 0',
        'height': '100%',
        'display': 'flex',
        'flex-direction': 'column',
        'justify-content': 'center'
      };
    } else {
      return {
        'padding': '10px 0',
        'height': '100%',
        'display': 'flex',
        'flex-direction': 'column',
        'justify-content': 'center'
      };
    }
  }

  private setButtonSize(): any {
    if (this.isFullScreen) {
      return {
        'height': '70px',
        'width': '100%'
      };
    } else {
      return {
        'height': '35px',
        'width': '100%'
      };
    }
  }

  setPrintButton(): any {
    if (this.detailLayout != null && this.detailLayout.printBtnImage == null && this.isFullScreen) {
      return {
        'font-size': '1.5em',
        'height': '70px',
        'background': this.detailLayout.printBtnColor,
        'border': this.detailLayout.printBtnBorderWidth + 'px solid ' + this.detailLayout.printBtnBorderColor,
        'color': this.detailLayout.printBtnBorderColor
      };
    } else if (this.detailLayout != null && this.detailLayout.printBtnImage == null && !this.isFullScreen) {
      return {
        'font-size': '1em',
        'height': '35px',
        'background': this.detailLayout.printBtnColor,
        'border': this.detailLayout.printBtnBorderWidth + 'px solid ' + this.detailLayout.printBtnBorderColor,
        'color': this.detailLayout.printBtnBorderColor
      };
    } else {
      return {'background': 'none', 'border': 'none'};
    }
  }

  /*
  setShareButton(): any {
    if (this.detailLayout != null && this.detailLayout.shareBtnImage == null) {
      return {
        'background': this.detailLayout.shareBtnColor,
        'border': this.detailLayout.shareBtnBorderWidth + 'px solid ' + this.detailLayout.shareBtnBorderColor,
        'color': this.detailLayout.shareBtnBorderColor

      };
    } else {
      return {'background': 'none', 'border': 'none'};
    }
  }
  */

  setBackButton(): any {
    if (this.detailLayout != null && this.detailLayout.backBtnImage == null && this.isFullScreen) {
      return {
        'font-size': '1.5em',
        'height': '70px',
        'background': this.detailLayout.backBtnColor,
        'border': this.detailLayout.backBtnBorderWidth + 'px solid ' + this.detailLayout.backBtnBorderColor,
        'color': this.detailLayout.backBtnBorderColor
      };
    } else if (this.detailLayout != null && this.detailLayout.backBtnImage == null && !this.isFullScreen) {
      return {
        'font-size': '1em',
        'height': '35px',
        'background': this.detailLayout.backBtnColor,
        'border': this.detailLayout.backBtnBorderWidth + 'px solid ' + this.detailLayout.backBtnBorderColor,
        'color': this.detailLayout.backBtnBorderColor
      };
    } else {
      return {'background': 'none', 'border': 'none'};
    }
  }

  setFinishButton(): any {
    if (this.detailLayout != null && this.detailLayout.finishBtnImage == null && this.isFullScreen) {
      return {
        'font-size': '1.5em',
        'height': '70px',
        'background': this.detailLayout.finishBtnColor,
        'border': this.detailLayout.finishBtnBorderWidth + 'px solid ' + this.detailLayout.finishBtnBorderColor,
        'color': this.detailLayout.finishBtnBorderColor
      };
    } else if (this.detailLayout != null && this.detailLayout.finishBtnImage == null && !this.isFullScreen) {
      return {
        'font-size': '1em',
        'height': '35px',
        'background': this.detailLayout.finishBtnColor,
        'border': this.detailLayout.finishBtnBorderWidth + 'px solid ' + this.detailLayout.finishBtnBorderColor,
        'color': this.detailLayout.finishBtnBorderColor
      };
    } else {
      return {'background': 'none', 'border': 'none'};
    }
  }

  setPrintMessage(): any {
    if (this.detailLayout !== null && this.detailLayout.printMessageImage === null && this.isFullScreen) {
      return {
        'font-size': '1.5em',
        'display': 'flex',
        'justify-content': 'center',
        'flex-direction': 'column',
        'text-align': 'center',
        'background-color': this.detailLayout.printMessageColor,
        'border': this.detailLayout.printMessageBorderWidth + 'px solid ' + this.detailLayout.printMessageBorderColor,
        'color': this.detailLayout.printMessageBorderColor
      };
    } else if (this.detailLayout !== null && this.detailLayout.printMessageImage === null && !this.isFullScreen) {
      return {
        'font-size': '1em',
        'display': 'flex',
        'justify-content': 'center',
        'flex-direction': 'column',
        'text-align': 'center',
        'background-color': this.detailLayout.printMessageColor,
        'border': this.detailLayout.printMessageBorderWidth + 'px solid ' + this.detailLayout.printMessageBorderColor,
        'color': this.detailLayout.printMessageBorderColor
      };
    } else {
      return {'background': 'none', 'border': 'none'};
    }
  }

  setImagePositionAndBackground(): any {
    if ((this.detailLayout.imagePosition === 0) && (this.detailLayout.backgroundImage)) {
      return {
        'flex-direction': 'row',
        'background-image': 'url(' + this.detailLayout.backgroundImage + ')',
        'background-repeat': 'round',
        'background-size:': 'cover'
      };
    } else if ((this.detailLayout.imagePosition === 0) && (!this.detailLayout.backgroundImage)) {
      return {'flex-direction': 'row', 'background-color': this.detailLayout.backgroundColor};
    } else if ((this.detailLayout.imagePosition !== 0) && (!this.detailLayout.backgroundImage)) {
      return {'flex-direction': 'row-reverse', 'background-color': this.detailLayout.backgroundColor};
    } else {
      return {
        'flex-direction': 'row-reverse',
        'background-image': 'url(' + this.detailLayout.backgroundImage + ')',
        'background-repeat': 'round',
        'background-size:': 'cover'
      };
    }
  }

  private setQrStyle(): any {
    if (this.isFullScreen) {
      return {
        'max-width': '40%'
      };
    } else {
      return {
        'max-width': '25%'
      };
    }
  }

  /**
   * select image
   */
  selectImage(img: Image) {
    this.selectedImage = img;
    console.log(this.selectedImage.imageNumber);
  }


  /*
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

  selectImage(img: Image) {
    this.selectedImage = img;
    console.log(this.selectedImage.imageNumber);
  }
  */
}
