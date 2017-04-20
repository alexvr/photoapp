import { Injectable } from '@angular/core';

let ipcRenderer;

if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  console.log("ipc renderer", ipcRenderer);
}

@Injectable()
export class PrinterService {

  private has_ipc: boolean;
  private printers: string[] = [];
  private selectedPrinter: string = null;

  /*
  ngOnInit(): void {
    console.log(this.printers);

    this.has_ipc = (typeof ipcRenderer != 'undefined');
    // Set listener
    if (this.has_ipc) {
      // Send async message to get all installed printers.
      ipcRenderer.send('async', 'get-all-printers');
      console.log("media-settings - getAllPrinters()");

      // Listen for async-reply to get all installed printers.
      ipcRenderer.on('async-get-all-printers', (event, arg) => {
        if (arg.length > this.printers.length || arg.length < this.printers.length) {
          this.printers = arg;
          console.log(this.printers);
        }
      });
    }
  }
  */


}
