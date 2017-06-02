import {Component, ViewChild, ElementRef, OnInit, OnDestroy} from "@angular/core";
import {ImageWatermark} from "../../../model/imageWatermark/ImageWatermark";
import {WatermarkConfigService} from "../../services/watermark-config.service";
import {ActivatedRoute} from "@angular/router";
import {PrinterService} from "../../services/printer.service";
import {ConfigurationService} from "../../services/configuration.service";
import {Observable} from "rxjs";

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

  private dimensionUnits: string[] = ['pixels', 'inches', 'centimeters'];
  private activeDimensionUnit: string = this.dimensionUnits[0];

  constructor(private watermarkConfigService: WatermarkConfigService, private configService: ConfigurationService, private activatedRoute: ActivatedRoute) {
    this.imageWatermark = new ImageWatermark();
  }

  ngOnInit(): void {
    // Set the imageWatermark for print or for web.
    this.activatedRoute.params.subscribe(params => {
      if (+params['id'] === 1) {
        this.isPrint = true;
        if (this.configService.getConfiguredEvent().config.printWatermark != null) {
          this.imageWatermark = this.configService.getConfiguredEvent().config.printWatermark;
        }
      } else {
        this.isPrint = false;
        if (this.configService.getConfiguredEvent().config.webWatermark != null) {
          this.imageWatermark = this.configService.getConfiguredEvent().config.webWatermark;
        }
      }

      // Set the logo and/or overlay images and draw the canvas.
      if (this.imageWatermark != null) {
        if (this.imageWatermark.logoLocation != null) {
          this.watermarkConfigService.getImageDataURI(this.imageWatermark.logoLocation).subscribe(val => {
            this.logo.src = val;
            if (this.imageWatermark.overlayLocation != null) {
              this.watermarkConfigService.getImageDataURI(this.imageWatermark.overlayLocation).subscribe(val => {
                this.overlay.src = val;
                this.draw();
              });
            } else {
              this.draw();
            }
          });
        } else if (this.imageWatermark.overlayLocation != null) {
          this.watermarkConfigService.getImageDataURI(this.imageWatermark.overlayLocation).subscribe(val => {
            this.overlay.src = val;
            this.draw();
          });
        } else {
          this.draw();
        }
      }
    });

  }

  ngOnDestroy(): void {
    this.activatedRoute.params.subscribe(params => {
        this.imageWatermark.print = this.isPrint;
        if (+params['id'] === 1) {
          this.configService.getConfiguredEvent().config.printWatermark = this.imageWatermark;
        } else {
          this.configService.getConfiguredEvent().config.webWatermark = this.imageWatermark;
        }
      }
    );
  }

  /**
   * This function draws the watermark on the canvas
   */
  draw() {
    console.log('watermark-config.component.ts - drawing canvas');
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
            this.imageWatermark.logoLocation = x;
            this.logo.onload = (() => this.draw());
            break;
          case 'overlay':
            this.overlay.src = y;
            this.imageWatermark.overlayLocation = x;
            this.overlay.onload = (() => this.draw());
            break;
        }
      });
    });
  }

  /**
   * formatting the chosen dimensions to pixels.
   */
  formatDimensions(dimension) {
    switch (this.activeDimensionUnit) {
      case this.dimensionUnits[0]:    //pixels
        return dimension;
      case this.dimensionUnits[1]:    //inches @300ppi
        return Math.round(dimension * 300);
      case this.dimensionUnits[2]:    //centimeters @300ppi
        return Math.round(dimension * 0.39370079 * 300);
    }
  }

  updateDimensionsUnit(dimension) {
    this.activeDimensionUnit = dimension;
  }

  setDimensionTypeStyle(dimension) {
    if (dimension === this.activeDimensionUnit) {
      return {
        'background': '#2880d0',
        'border-color': '#245988',
        'color': '#fff',
      };
    } else {
      return {
        'background': '#fff',
        'border-color': '#ccc',
        'color': '#333',
      };
    }
  }
}
