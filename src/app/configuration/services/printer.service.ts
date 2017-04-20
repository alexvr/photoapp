import {Injectable} from '@angular/core';

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  //console.log("ipc renderer", ipcRenderer);
}

@Injectable()
export class PrinterService {

  private hasIpc: boolean;
  private selectedPrinter: string;

  /**
   * Get all printers installed on this machine.
   * @returns string[] of printers
   */
  getAllPrinters(): string[] {
    let printers: string[] = [];

    this.hasIpc = (typeof ipcRenderer != 'undefined');
    // Set listener
    if (this.hasIpc) {
      // Send async message to get all installed printers.
      ipcRenderer.send('async', 'get-all-printers');
      console.log("media-settings - getAllPrinters()");

      // Listen for async-reply to get all installed printers.
      ipcRenderer.on('async-get-all-printers', (event, arg) => {
        printers = arg;
        console.log("PrinterService - " + printers);
      });
    }

    return printers;
  }

  /**
   * Select printer for event.
   * @param printer
   */
  selectPrinter(printer: string): void {
    this.selectedPrinter = printer;
  }

  /**
   * Get selected printer for event.
   * @returns Name of printer
   */
  getSelectedPrinter(): string {
    return this.selectedPrinter;
  }


}
