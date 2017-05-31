import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'dimensionsPipe'})
export class DimensionsPipe implements PipeTransform {

  transform(value: any, dimensionType: string): any {
    switch (dimensionType) {
      case 'pixels':          //pixels
        return value;
      case 'inches':          //inches @300ppi
        return Math.round((value / 300) * 100) / 100;
      case 'centimeters':     //centimeters @300ppi
        return Math.round((value / 300 * 2.54) * 100) / 100;
    }
  }
}
