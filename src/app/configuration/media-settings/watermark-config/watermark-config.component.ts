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
  private image = new Image();
  private logo = new Image();
  private overlay = new Image();

  constructor(private watermarkConfigService: WatermarkConfigService, private activatedRoute: ActivatedRoute) {
    this.image.src = "assets/images/photo.jpg";

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
      this.image.onload = (() => {
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
    console.log("draw!");
    let ctx = this.canvasRef.nativeElement.getContext("2d");
    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    // IMAGE
    ctx.drawImage(this.image,
      this.imageWatermark.imageX, this.imageWatermark.imageY,
      (this.image.width / 100 * this.imageWatermark.imageScale), (this.image.height / 100 * this.imageWatermark.imageScale));

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
   * This function loads in a file via input and uses it in the canvas
   * @param event, a reference to the file
   * @param imageType, the type of image that is imported (logo, overlay, ...)
   */
  /*
   onFileSelected(event, imageType) {
   let selectedFile = event.target.files[0];
   let reader = new FileReader();
   let tempImg = new Image();

   console.log(event.target.files[0]);
   console.log(event.target.files[0].path);

   tempImg.title = selectedFile.name;
   reader.onload = (() => tempImg.src = reader.result);

   reader.readAsDataURL(selectedFile);

   switch (imageType) {
   case 'logo':
   this.logo = tempImg;
   this.logo.onload = (() => this.draw());
   break;
   case 'overlay':
   this.overlay = tempImg;
   this.overlay.onload = (() => this.draw());
   break;
   }
   }*/

  /**
   * This function gets an image, with the use of Electron and nodeJS, through a choose-file dialog of the OS. The image is sent as a URI.
   * @param imageType, the type of image that is imported (logo, overlay, ...)
   */
  getImage(imageType) {
    this.watermarkConfigService.getImage().subscribe(x => {
      switch (imageType) {
        case 'logo':
          this.logo.src = x;
          this.imageWatermark.logoLocation = x;
          this.logo.onload = (() => this.draw());
          break;
        case 'overlay':
          this.overlay.src = x;
          this.imageWatermark.overlayLocation = x;
          this.overlay.onload = (() => this.draw());
          break;
      }
    });
  }
}
