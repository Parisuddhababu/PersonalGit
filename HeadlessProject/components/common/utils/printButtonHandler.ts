import { downloadReadOnlyPdf } from './convertToPdf'

export const printBtnHandler = async (elementId: HTMLDivElement) => {
  elementId.style.display = 'block'
  await downloadReadOnlyPdf(elementId)
  elementId.style.display = 'none'
}
