import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FieldType } from '../model/fieldTypes';

const PAGE_WIDTH = 595; // A4 ~ 72dpi
const PAGE_HEIGHT = 842;

function toPdfY(y, height){
  return PAGE_HEIGHT - y - height; // convert top-left to bottom-left
}

export async function buildPdf({ pages, backgrounds, fields, options }) {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Create all pages upfront with fixed size
  const pdfPages = pages.map(()=> pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]));
  const form = options.acroForm ? pdfDoc.getForm() : null;

  // Background images
  for (const p of pages) {
    const idx = pages.findIndex(pg=>pg.id===p.id);
    const pageRef = pdfPages[idx];
    const bg = backgrounds[p.id];
    if(bg){
      const imgBytes = Uint8Array.from(atob(bg.split(',')[1]), c => c.charCodeAt(0));
      let img;
      if (bg.startsWith('data:image/png')) img = await pdfDoc.embedPng(imgBytes); else img = await pdfDoc.embedJpg(imgBytes);
      pageRef.drawImage(img, { x:0, y:0, width: PAGE_WIDTH, height: PAGE_HEIGHT });
    }
  }

  // Fields
  for(const f of fields){
    const idx = pages.findIndex(p=>p.id===f.pageId);
    if(idx===-1) continue; const page = pdfPages[idx];
    const x = f.x; const y = toPdfY(f.y, f.height);
    switch(f.type){
      case FieldType.TEXT:
      case FieldType.DATE:
        if(form){
          const tf = form.createTextField(f.id);
          tf.setText(String(f.value||''));
          tf.addToPage(page, { x, y, width:f.width, height:f.height });
        } else {
          page.drawText(String(f.value||''), { x, y: y + (f.height - (f.style.fontSize||12))*0.7, size:f.style.fontSize||12, font:helvetica, color: rgb(0,0,0) });
        }
        break;
      case FieldType.CHECKBOX:
        if(form){
          const cb = form.createCheckBox(f.id);
            if(f.value) cb.check();
            cb.addToPage(page, { x, y, width:f.width, height:f.height });
        } else {
          page.drawRectangle({ x, y, width:f.width, height:f.height, borderWidth:1 });
          if(f.value){ page.drawText('✓', { x:x+2, y:y+2, size: f.height-4, font: helvetica }); }
        }
        break;
      case FieldType.QR:
      case FieldType.BARCODE:
      case FieldType.IMAGE:
      case FieldType.SIGNATURE:
        if(f.meta?.dataUrl || f.meta?.src){
          const dataUrl = f.meta.dataUrl || f.meta.src;
          const imgBytes = Uint8Array.from(atob(dataUrl.split(',')[1]), c => c.charCodeAt(0));
          let img;
          if(dataUrl.startsWith('data:image/png')) img = await pdfDoc.embedPng(imgBytes); else img = await pdfDoc.embedJpg(imgBytes);
          page.drawImage(img, { x, y, width: f.width, height: f.height });
        }
        break;
      default:
        break;
    }
  }

  if(options.acroForm && options.flatten){
    form.flatten();
  }

  return pdfDoc.save();
}

export const PAGE_SIZE = { width: PAGE_WIDTH, height: PAGE_HEIGHT };
