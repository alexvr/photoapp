import {Component, OnInit} from "@angular/core";
import {QrCodeService} from "../services/qr-code.service";
@Component({
  selector: 'event-detail',
  templateUrl: 'event-detail.component.html',
  styleUrls: ['event-detail.component.css']
})

export class EventDetailComponent implements OnInit {
  constructor(private qrCodeService: QrCodeService) {

  }

  ngOnInit(): void {
    this.qrCodeService.getQrCode().subscribe(x => console.log(x));
  }
}
