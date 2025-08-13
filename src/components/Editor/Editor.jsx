import React, { useEffect, useMemo, useReducer, useState } from 'react';
import Toolbar from './Toolbar.jsx';
import ThumbnailStrip from './components/ThumbnailStrip.jsx';
import FieldBox from './components/FieldBox.jsx';
import PropertyPanel from './components/PropertyPanel.jsx';
import { FieldType, createField, cloneField, serializeTemplate, deserializeTemplate } from './model/fieldTypes';
import { saveAs } from 'file-saver';
import { buildPdf, PAGE_SIZE } from './utils/pdfExport.js';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

function fieldsReducer(state, action){
  switch(action.type){
    case 'ADD': return [...state, action.field];
    case 'UPDATE': return state.map(f=> f.id===action.id? { ...f, ...action.updates }: f);
    case 'REMOVE': return state.filter(f=> f.id!==action.id);
    case 'BULK_SET': return [...action.fields];
    default: return state;
  }
}

function Editor(){
  const [pages, setPages] = useState([{ id:1 }]);
  const [backgrounds, setBackgrounds] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [fields, dispatch] = useReducer(fieldsReducer, []);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [templateName, setTemplateName] = useState('Untitled Template');
  const [livePdfUrl, setLivePdfUrl] = useState(null);
  const [exportOptions, setExportOptions] = useState({ acroForm:true, flatten:false });
  const [showSignatureCapture, setShowSignatureCapture] = useState(false);
  const [signatureTargetField, setSignatureTargetField] = useState(null);
  const selectedField = useMemo(()=> fields.find(f=>f.id===selectedFieldId), [fields, selectedFieldId]);

  const addPage = () => {
    const id = pages.length? Math.max(...pages.map(p=>p.id))+1: 1;
    setPages([...pages, { id }]); setActivePage(id);
  };
  const handleUploadBackground = (files) => {
    [...files].forEach(file=> { const r=new FileReader(); r.onload=e=> setBackgrounds(b=> ({ ...b, [activePage]: e.target.result })); r.readAsDataURL(file); });
  };
  const addField = (type) => { const f = createField(type, { pageId: activePage }); dispatch({ type:'ADD', field:f }); setSelectedFieldId(f.id); };
  const updateField = (id, updates) => dispatch({ type:'UPDATE', id, updates });
  const exportTemplateJson = () => { const json = serializeTemplate(pages, backgrounds, fields); saveAs(new Blob([json],{ type:'application/json'}), `${templateName||'template'}.json`); };
  const importTemplateJson = (file) => { const r=new FileReader(); r.onload=e=> { const { pages:p, backgrounds:b, fields:f } = deserializeTemplate(e.target.result); setPages(p); setBackgrounds(b); dispatch({ type:'BULK_SET', fields:f }); setActivePage(p[0]?.id||1); }; r.readAsText(file); };
  useEffect(()=> { const t=setTimeout(async()=>{ try { const bytes = await buildPdf({ pages, backgrounds, fields, options:{ acroForm:false, flatten:true }}); const url = URL.createObjectURL(new Blob([bytes],{ type:'application/pdf'})); setLivePdfUrl(prev=> { if(prev) URL.revokeObjectURL(prev); return url; }); } catch(e){ console.error(e);} },300); return ()=> clearTimeout(t); }, [pages, backgrounds, fields]);
  const exportPdf = async () => { const bytes = await buildPdf({ pages, backgrounds, fields, options: exportOptions }); saveAs(new Blob([bytes],{ type:'application/pdf'}), `${templateName||'export'}.pdf`); };
  const validateField = (f) => { if(f.required && !String(f.value||'').trim()) return 'Required'; if(f.validation?.regex){ try{ if(!new RegExp(f.validation.regex).test(String(f.value||''))) return 'Invalid'; }catch{} } return null; };
  const duplicateField = (f) => { const d = cloneField(f, { x:f.x+10, y:f.y+10 }); dispatch({ type:'ADD', field:d }); setSelectedFieldId(d.id); };
  const deleteField = (id) => dispatch({ type:'REMOVE', id });
  const reorderPages = (from,to) => { const arr=[...pages]; const [m]=arr.splice(from,1); arr.splice(to,0,m); setPages(arr); };
  const generateCodeImage = async (f) => { if(f.type===FieldType.QR){ const dataUrl = await QRCode.toDataURL(f.meta.data||f.value||''); updateField(f.id,{ meta:{ ...f.meta, dataUrl }}); } else if(f.type===FieldType.BARCODE){ const canvas=document.createElement('canvas'); try{ JsBarcode(canvas, f.meta.data||f.value||'',{ displayValue:false }); updateField(f.id,{ meta:{ ...f.meta, dataUrl: canvas.toDataURL('image/png') }}); }catch(e){ console.warn('Barcode error',e);} } };
  const openSignature = (f) => { setSignatureTargetField(f); setShowSignatureCapture(true); };
  const applySignature = (dataUrl) => { if(signatureTargetField) updateField(signatureTargetField.id,{ meta:{ ...signatureTargetField.meta, dataUrl }}); setShowSignatureCapture(false); setSignatureTargetField(null); };
  const pageStats = `${pages.length} page${pages.length!==1?'s':''} • ${fields.length} field${fields.length!==1?'s':''}`;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="flex items-center gap-4 px-5 py-2.5 border-b border-slate-200 bg-white/80 backdrop-blur">
        <h1 className="text-lg font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-500">Dynamic PDF Builder</h1>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"/> {pageStats}</span>
        </div>
        <div className="flex items-center gap-2 ml-6">
          <input className="text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/60" value={templateName} onChange={e=>setTemplateName(e.target.value)} placeholder="Template name" />
          <button className="inline-flex items-center gap-1 rounded-md bg-sky-600 text-white text-[11px] font-medium px-3 py-1.5 shadow-sm hover:bg-sky-500" onClick={exportTemplateJson}>Save</button>
          <button className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white text-[11px] font-medium px-3 py-1.5 shadow-sm hover:bg-emerald-500" onClick={exportPdf}>PDF</button>
        </div>
        <div className="ml-auto flex items-center gap-4 text-[11px] text-slate-600">
          <label className="flex items-center gap-1 cursor-pointer select-none"><input type="checkbox" className="accent-sky-600" checked={exportOptions.acroForm} onChange={e=> setExportOptions(o=> ({ ...o, acroForm: e.target.checked }))} /><span>AcroForm</span></label>
          <label className="flex items-center gap-1 cursor-pointer select-none opacity-80"><input type="checkbox" className="accent-sky-600" disabled={!exportOptions.acroForm} checked={exportOptions.flatten} onChange={e=> setExportOptions(o=> ({ ...o, flatten: e.target.checked }))} /><span>Flatten</span></label>
        </div>
      </header>
      <div className="flex flex-1 gap-4 px-4 py-4 overflow-hidden">
        <Toolbar onAddPage={addPage} onUploadBackground={handleUploadBackground} onAddField={addField} onExportTemplate={exportTemplateJson} onImportTemplate={importTemplateJson} onExportPdf={exportPdf} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <ThumbnailStrip pages={pages} backgrounds={backgrounds} activePage={activePage} onSelect={setActivePage} onReorder={reorderPages} />
          <div className="flex-1 overflow-auto p-8 space-y-12 rounded-xl bg-slate-100 bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:42px_42px]">
            {pages.map(p => (
              <div key={p.id} className={"group relative mx-auto bg-white shadow-sm transition-all duration-300 rounded-md " + (p.id===activePage?"ring-2 ring-sky-500 scale-[1.012] shadow-md":"ring ring-slate-300 hover:shadow-md")} style={{ width: PAGE_SIZE.width, height: PAGE_SIZE.height, backgroundImage: backgrounds[p.id]?`url(${backgrounds[p.id]})`:undefined, backgroundSize:'cover', backgroundRepeat:'no-repeat' }} onMouseDown={()=> setSelectedFieldId(null) }>
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
                {fields.filter(f=>f.pageId===p.id).map(f => (
                  <FieldBox key={f.id} field={f} selected={f.id===selectedFieldId} onSelect={setSelectedFieldId} onUpdate={updateField} validateError={validateField(f)} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="w-[360px] flex flex-col gap-4">
          <section className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm backdrop-blur-sm">
            <h3 className="text-[11px] font-semibold tracking-wide text-slate-700 uppercase mb-2">Field Properties</h3>
            <PropertyPanel field={selectedField} onUpdate={updateField} onDelete={deleteField} onDuplicate={duplicateField} onGenerateCode={generateCodeImage} onOpenSignature={openSignature} />
          </section>
          <section className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm backdrop-blur-sm">
            <h3 className="text-[11px] font-semibold tracking-wide text-slate-700 uppercase mb-2">Export Options</h3>
            <label><input type="checkbox" checked={exportOptions.acroForm} onChange={e=> setExportOptions(o=> ({ ...o, acroForm: e.target.checked }))} /> Include AcroForm fields</label>
            <label><input type="checkbox" checked={exportOptions.flatten} onChange={e=> setExportOptions(o=> ({ ...o, flatten: e.target.checked }))} disabled={!exportOptions.acroForm} /> Flatten (make non-editable)</label>
            <button className="mt-2 inline-flex items-center gap-1 rounded-md border border-sky-600 bg-sky-600 text-white px-3 py-1 text-xs font-medium hover:bg-sky-500" onClick={exportPdf}>Export PDF</button>
          </section>
          <section className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex-1 overflow-hidden flex flex-col backdrop-blur-sm">
            <h3 className="text-[11px] font-semibold tracking-wide text-slate-700 uppercase mb-2">Live PDF Preview</h3>
            <div className="flex-1 overflow-auto rounded border border-slate-200 bg-slate-50">
              {livePdfUrl ? <iframe title="pdf" src={livePdfUrl} className="w-full h-[400px]" /> : <p className="text-xs text-slate-500 p-2">Generating...</p>}
            </div>
          </section>
        </div>
      </div>
      <footer className="h-7 flex items-center justify-between px-4 text-[10px] tracking-wide uppercase bg-white/70 border-t border-slate-200 text-slate-500">
        <span>{templateName || 'Untitled'} • {pages.length} pages • {fields.length} fields</span>
        <span>PDF Builder © {new Date().getFullYear()}</span>
      </footer>
      {showSignatureCapture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 w-[500px] rounded shadow-lg space-y-3">
            <h3 className="text-sm font-semibold">Signature Capture (placeholder)</h3>
            <p className="text-xs text-slate-600">Integrate signature_pad here.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={()=> setShowSignatureCapture(false)}>Cancel</button>
              <button onClick={()=> applySignature('')}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;