// Toolbar.js
import React from 'react';
import { FaPlus, FaFilePdf, FaImage, FaFont, FaCalendarAlt, FaCheckSquare, FaSignature, FaQrcode, FaBarcode, FaFileExport, FaFileImport } from 'react-icons/fa';
import { FieldType } from './model/fieldTypes';

function Toolbar({ onAddPage, onUploadBackground, onAddField, onExportTemplate, onImportTemplate, onExportPdf }) {
  const fileRef = React.useRef();
  const templateRef = React.useRef();
  const triggerUpload = () => fileRef.current?.click();
  const triggerTemplateImport = () => templateRef.current?.click();
  return (
    <div className="w-[220px] flex flex-col gap-2 p-3 border-r border-slate-200 bg-white/70 backdrop-blur text-xs">
      <h3 className="mt-0 mb-1 text-sm font-semibold tracking-wide text-slate-700">Toolbar</h3>
      <button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm" onClick={onAddPage}><FaPlus/> <span>Add Page</span></button>
      <button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm" onClick={triggerUpload}><FaImage/> <span>Page Background</span></button>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e=>{ if(e.target.files?.length) onUploadBackground(e.target.files); e.target.value=''; }} />
      <div className="grid grid-cols-3 gap-1">
        <button className="h-8 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600" onClick={()=>onAddField(FieldType.TEXT)} title="Text"><FaFont/></button>
        <button className="h-8 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600" onClick={()=>onAddField(FieldType.DATE)} title="Date"><FaCalendarAlt/></button>
        <button className="h-8 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600" onClick={()=>onAddField(FieldType.CHECKBOX)} title="Checkbox"><FaCheckSquare/></button>
        <button className="h-8 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600" onClick={()=>onAddField(FieldType.SIGNATURE)} title="Signature"><FaSignature/></button>
        <button className="h-8 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600" onClick={()=>onAddField(FieldType.QR)} title="QR"><FaQrcode/></button>
        <button className="h-8 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600" onClick={()=>onAddField(FieldType.BARCODE)} title="Barcode"><FaBarcode/></button>
      </div>
      <div className="my-2 h-px bg-slate-200" />
      <button className="inline-flex items-center gap-1 rounded-md border border-sky-600 bg-sky-600 text-white px-2 py-1 hover:bg-sky-500 active:bg-sky-600 shadow" onClick={onExportPdf}><FaFilePdf/> <span>Export PDF</span></button>
      <button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm" onClick={onExportTemplate}><FaFileExport/> <span>Export JSON</span></button>
      <button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm" onClick={triggerTemplateImport}><FaFileImport/> <span>Import JSON</span></button>
      <input ref={templateRef} type="file" accept="application/json" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onImportTemplate(f); e.target.value=''; }} />
    </div>
  );
}

export default Toolbar;