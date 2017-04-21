import {Component, ViewChild, ElementRef} from "@angular/core";

@Component({
  selector: 'event-screen',
  templateUrl: 'event-screen.component.html',
  styleUrls: ['event-screen.component.css']
})

export class EventScreenComponent {

  /*
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

  /*
   *  Show the menu on 3 clicks in left corner and 1 in the right corner.
   *  */
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
}
