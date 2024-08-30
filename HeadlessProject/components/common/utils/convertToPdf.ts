/* eslint-disable object-shorthand */
/* eslint-disable func-names */

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function downloadReadOnlyPdf(ele: HTMLElement, highQuality = true) {
  const width = 2480
  const height = 3508
  await html2canvas(ele, {
    scale: highQuality === true ? 2 : 1,
    scrollY: window.scrollY, // Capture the entire content, including scrollable portion
  }).then((canvas) => {
    const contentDataURL = canvas.toDataURL('image/jpeg', 0.7) // Use JPEG format with lower quality

    const pdf = new jsPDF('p', 'pt', [width, height]) // A4 size page of PDF
    const position = 0
    const imgWidth = pdf.internal.pageSize.getWidth()
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight)
    pdf.output('dataurlnewwindow')
  })
}
