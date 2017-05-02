import {Component, ViewChild, ElementRef, OnInit} from "@angular/core";
import {ImageWatermark} from "../../../model/imageWatermark/ImageWatermark";

@Component({
  selector: 'watermark-config',
  templateUrl: 'watermark-config.component.html',
  styleUrls: ['watermark-config.component.css']
})

export class WatermarkConfigComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  private imageWatermark: ImageWatermark;
  private image = new Image();

  constructor() {
    this.imageWatermark = new ImageWatermark();
  }

  ngOnInit(): void {
    this.image.src = "../../../../assets/images/photo.jpg";
    this.draw();
  }

  draw() {
    console.log("drawing...");
    let ctx = this.canvasRef.nativeElement.getContext("2d");
    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    ctx.drawImage(this.image,
      this.imageWatermark.imageX, this.imageWatermark.imageY,
      (this.image.width / 100 * this.imageWatermark.imageScale), (this.image.height / 100 * this.imageWatermark.imageScale));
  }
}
