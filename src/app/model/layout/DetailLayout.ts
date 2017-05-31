import {Layout} from './Layout';
import {Position} from './Position';

export class DetailLayout extends Layout {
  printBtnText: string;
  printBtnColor: string;
  printBtnImage: string;
  printBtnBorderColor: string;
  printBtnBorderWidth: number;

  shareBtnText: string;
  shareBtnColor: string;
  shareBtnImage: string;
  shareBtnBorderColor: string;
  shareBtnBorderWidth: number;

  backBtnText: string;
  backBtnColor: string;
  backBtnImage: string;
  backBtnBorderColor: string;
  backBtnBorderWidth: number;

  finishBtnText: string;
  finishBtnColor: string;
  finishBtnImage: string;
  finishBtnBorderColor: string;
  finishBtnBorderWidth: number;

  imagePosition: Position;

  printMessageImage: string;
  printMessageText: string;
  printMessageColor: string;
  printMessageBorderColor: string;
  printMessageBorderWidth: number;

  constructor() {
    super();
    this.printBtnText = 'Print';
    this.printBtnColor = '#ffffff';
    this.printBtnImage = '';
    this.printBtnBorderColor = '#4d4d4d';
    this.printBtnBorderWidth = 1;

    this.shareBtnText = 'Share';
    this.shareBtnColor = '#ffffff';
    this.shareBtnImage = '';
    this.shareBtnBorderColor = '#4d4d4d';
    this.shareBtnBorderWidth = 1;

    this.backBtnText = 'Back';
    this.backBtnColor = '#ffffff';
    this.backBtnImage = '';
    this.backBtnBorderColor = '#4d4d4d';
    this.backBtnBorderWidth = 1;

    this.finishBtnText = 'Finish';
    this.finishBtnColor = '#ffffff';
    this.finishBtnImage = '';
    this.finishBtnBorderColor = '#4d4d4d';
    this.finishBtnBorderWidth = 1;

    this.imagePosition = Position.LEFT;

    this.printMessageText = 'Image is printed!';
    this.printMessageColor = '#bbbbbb';
    this.printMessageImage = '';
    this.printMessageBorderColor = '#ffffff';
    this.printMessageBorderWidth = 0;
  }
}
