import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
@Injectable({
  providedIn: 'root',
})
export class DownloadPdfService {
  constructor() {}

  async downloadPdf(ele: HTMLElement, fileName = 'file.pdf', callBack = null) {
    ele.style.color = 'black';
    const width = ele.offsetWidth;
    const height = ele.offsetHeight;
    const doc = new jsPDF(height < width ? 'l' : 'p', 'px', [width, height], true);
    await doc.html(ele);
    doc.save(fileName);
    if (callBack) {
      callBack();
    }
  }

  async downloadReadOnlyPdf(ele: HTMLElement, fileName = 'file.pdf', highQuality: boolean = false, callBack = null) {
    const width = ele.offsetWidth;
    const height = ele.offsetHeight;
    html2canvas(ele, { scale: highQuality === true ? 2 : 1 }).then((canvas) => {
      const img = canvas.toDataURL('image/png', 1.0);
      const doc = new jsPDF(height < width ? 'l' : 'p', 'px', [width, height], true);
      doc.addImage(img, 'PNG', 0, 0, width, height);
      doc.save(fileName);
      if (callBack) {
        callBack();
      }
    });
  }
  private detectMob(): boolean {
    return window.innerWidth <= 800 && window.innerHeight <= 600;
  }
}
