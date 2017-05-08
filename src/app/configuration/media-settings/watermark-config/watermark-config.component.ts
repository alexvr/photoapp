import {Component, ViewChild, ElementRef, OnInit, OnDestroy} from "@angular/core";
import {ImageWatermark} from "../../../model/imageWatermark/ImageWatermark";
import {WatermarkConfigService} from "../../services/watermark-config.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'watermark-config',
  templateUrl: 'watermark-config.component.html',
  styleUrls: ['watermark-config.component.css']
})

export class WatermarkConfigComponent implements OnInit, OnDestroy {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  private isPrint: boolean = false;
  private imageWatermark: ImageWatermark;
  private logo = new Image();
  private overlay = new Image();

  constructor(private watermarkConfigService: WatermarkConfigService, private activatedRoute: ActivatedRoute) {
    this.imageWatermark = new ImageWatermark();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (+params['id'] === 1) {
        this.isPrint = true;
        if (this.watermarkConfigService.getPrintWatermark() != null) {
          this.imageWatermark = this.watermarkConfigService.getPrintWatermark()
        }
      } else {
        this.isPrint = false;
        if (this.watermarkConfigService.getWebWatermark() != null) {
          this.imageWatermark = this.watermarkConfigService.getWebWatermark();
        }
      }
      if (this.imageWatermark != null) {
        if (this.imageWatermark.logoLocation != null) {
          this.logo.src = this.imageWatermark.logoLocation;
        }
        if (this.imageWatermark.overlayLocation != null) {
          this.overlay.src = this.imageWatermark.overlayLocation;
        }
      }
      this.draw();
    });
  }


  ngOnDestroy(): void {
    this.activatedRoute.params.subscribe(params => {
        this.imageWatermark.print = this.isPrint;
        if (+params['id'] === 1) {
          this.watermarkConfigService.setPrintWatermark(this.imageWatermark);
        } else {
          this.watermarkConfigService.setWebWatermark(this.imageWatermark);
        }
      }
    );
  }

  /**
   * This function draws the watermark on the canvas
   */
  draw() {
    let ctx = this.canvasRef.nativeElement.getContext("2d");
    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    // IMAGE RECTANGLE
    ctx.fillStyle = "#2e87fe";
    ctx.fillRect(this.imageWatermark.imageX, this.imageWatermark.imageY,
      (this.imageWatermark.imageWidth / 100 * this.imageWatermark.imageScale), (this.imageWatermark.imageHeight / 100 * this.imageWatermark.imageScale));

    // OVERLAY
    ctx.drawImage(this.overlay,
      this.imageWatermark.overlayX, this.imageWatermark.overlayY,
      (this.overlay.width / 100 * this.imageWatermark.overlayScale), (this.overlay.height / 100 * this.imageWatermark.overlayScale));

    // LOGO
    ctx.drawImage(this.logo,
      this.imageWatermark.logoX, this.imageWatermark.logoY,
      (this.logo.width / 100 * this.imageWatermark.logoScale), (this.logo.height / 100 * this.imageWatermark.logoScale));
  }

  /**
   * This function gets an image, with the use of Electron and nodeJS, through a choose-file dialog of the OS. The image is sent as a URI.
   * @param imageType, the type of image that is imported (logo or overlay)
   */
  getImage(imageType) {
    this.watermarkConfigService.getImage().subscribe(x => {
      this.watermarkConfigService.getImageDataURI(x).subscribe(y => {
        switch (imageType) {
          case 'logo':
            this.logo.src = y;
            this.imageWatermark.logoLocation = y;
            this.logo.onload = (() => this.draw());
            break;
          case 'overlay':
            this.overlay.src = y;
            this.imageWatermark.overlayLocation = y;
            this.overlay.onload = (() => this.draw());
            break;
        }
      });
    });
  }
}
