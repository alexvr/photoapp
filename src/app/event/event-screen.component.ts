import {Component} from "@angular/core";

@Component({
  selector: 'event-screen',
  templateUrl: 'event-screen.component.html',
  styleUrls: ['event-screen.component.css']
})

export class EventScreenComponent{
  config: Object = {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    paginationClickable: true,
    spaceBetween: 30
  };
}
