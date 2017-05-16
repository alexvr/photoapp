import {Position} from './Position';

export class Layout {
  id: number;
  logo: string;
  logoPosition: Position;
  backgroundColor: string;
  backgroundImage: string;
  imageBorderColor: string;
  imageBorderWidth: number;

  constructor() {
    this.logoPosition = Position.CENTER;
    this.backgroundColor = '#bbbbbb';
    this.imageBorderColor = '#ffffff';
    this.imageBorderWidth = 0;
  }
}
