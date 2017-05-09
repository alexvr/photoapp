import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import {OverviewLayout} from "../../model/layout/OverviewLayout";

@Component({
  selector: 'event-overview',
  templateUrl: 'event-overview.component.html',
  styleUrls: ['event-overview.component.css']
})

export class EventOverviewComponent {
  @Input() overviewLayout: OverviewLayout;

  /**
   * Configuration of carousel
   * */
  private config: Object = {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    paginationClickable: true,
    spaceBetween: 30
  };

  constructor() {
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

  setLogo(): any {
    switch (this.overviewLayout.logoPosition) {
      case 0:
        return {'justify-content': 'flex-start'};
      case 1:
        return {'justify-content': 'center'};
      case 2:
        return {'justify-content': 'flex-end'};
    }
  }

  setImageContainerStyle(): any {
    if (this.overviewLayout != null && this.overviewLayout.imageContainer) {
      return {
        'background-color': this.overviewLayout.imageContainerColor,
        'border': this.overviewLayout.imageContainerBorderWidth + "px solid " + this.overviewLayout.imageContainerBorderColor
      }
    } else {
      return {
        'background': 'none',
        'border': 'none'
      }
    }
  }

  setImageStyle(): any {
    if (this.overviewLayout != null) {
      return {
        'border': this.overviewLayout.imageBorderWidth + 'px solid ' + this.overviewLayout.imageBorderColor
      }
    } else {
      return {'border': 'none'}
    }
  }

  setSelectionContainerStyle(): any {
    if (this.overviewLayout != null && this.overviewLayout.selectionContainer) {
      return {
        'background-color': this.overviewLayout.selectionContainerColor,
        'border': this.overviewLayout.selectionContainerBorderWidth + 'px solid ' + this.overviewLayout.selectionContainerBorderColor
      }
    } else {
      return {
        'background': 'none',
        'border': 'none'
      }
    }
  }

}
