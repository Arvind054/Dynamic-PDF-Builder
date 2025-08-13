import React from 'react';
import { FieldType } from '../model/fieldTypes';

export default function PropertyPanel({ field, onUpdate, onDelete, onDuplicate, onGenerateCode, onOpenSignature }) {
  if(!field) return <p>No field selected.</p>;
  const updateStyle = (patch) => onUpdate(field.id, { style: { ...field.style, ...patch }});
  return (
    <div className="flex flex-col gap-2 text-xs">
      <strong className="text-[11px] tracking-wide">{field.type.toUpperCase()} Field</strong>
      {field.type===FieldType.CHECKBOX ? (
        <label className="flex items-center gap-2">Checked <input type="checkbox" checked={!!field.value} onChange={e=>onUpdate(field.id,{ value:e.target.checked })} /></label>
      ) : field.type===FieldType.SIGNATURE ? (
  <button className="inline-flex items-center justify-center rounded border border-slate-300 px-2 py-1 text-[11px] bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm" onClick={()=>onOpenSignature(field)}>Capture Signature</button>
      ) : (
        <label className="flex flex-col gap-1">Value <input className="border border-slate-300 rounded px-2 py-1" value={field.value} onChange={e=>onUpdate(field.id,{ value:e.target.value })} /></label>
      )}
      {(field.type===FieldType.IMAGE) && (
        <label className="flex flex-col gap-1">Image <input className="text-[11px]" type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(file){ const r=new FileReader(); r.onload=ev=> onUpdate(field.id,{ meta:{...field.meta, src: ev.target.result }}); r.readAsDataURL(file);} }} /></label>
      )}
      {(field.type===FieldType.QR || field.type===FieldType.BARCODE) && (
        <>
          <label className="flex flex-col gap-1">Data <input className="border border-slate-300 rounded px-2 py-1" value={field.meta.data||''} onChange={e=>onUpdate(field.id,{ meta: { ...field.meta, data: e.target.value } })} /></label>
          <button className="inline-flex items-center justify-center rounded border border-slate-300 px-2 py-1 text-[11px] bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm" onClick={()=>onGenerateCode(field)}>Generate {field.type===FieldType.QR? 'QR':'Barcode'}</button>
        </>
      )}
      <label className="flex flex-col gap-1">Font Size <input className="border border-slate-300 rounded px-2 py-1" type="number" value={field.style.fontSize} onChange={e=>updateStyle({ fontSize: parseInt(e.target.value)||12 })} /></label>
      <label className="flex flex-col gap-1">Font Family <input className="border border-slate-300 rounded px-2 py-1" value={field.style.fontFamily} onChange={e=>updateStyle({ fontFamily: e.target.value })} /></label>
      <label className="flex flex-col gap-1">Color <input className="h-6" type="color" value={field.style.color} onChange={e=>updateStyle({ color: e.target.value })} /></label>
      <label className="flex flex-col gap-1">Opacity <input className="w-full" type="range" min={0.1} max={1} step={0.05} value={field.opacity} onChange={e=>onUpdate(field.id,{ opacity: parseFloat(e.target.value) })} /></label>
      <label className="flex flex-col gap-1">Rotation <input className="border border-slate-300 rounded px-2 py-1" type="number" value={field.rotation||0} onChange={e=>onUpdate(field.id,{ rotation: parseInt(e.target.value)||0 })} /></label>
      <label className="flex items-center gap-2">Required <input type="checkbox" checked={field.required} onChange={e=>onUpdate(field.id,{ required: e.target.checked })} /></label>
      <label className="flex flex-col gap-1">Regex <input className="border border-slate-300 rounded px-2 py-1" value={field.validation.regex||''} onChange={e=>onUpdate(field.id,{ validation: { ...field.validation, regex: e.target.value } })} /></label>
          {field.type!==FieldType.CHECKBOX && field.type!==FieldType.SIGNATURE && (
            <div className="flex gap-1">
              {['left','center','right'].map(a => {
                const active = field.style.textAlign===a;
                return (
                  <button type="button" key={a} className={("flex-1 px-2 py-1 rounded border text-[11px] ") + (active?"bg-sky-600 text-white border-sky-600":"bg-white border-slate-300") } onClick={()=>updateStyle({ textAlign:a })}>{a[0].toUpperCase()}</button>
                );
              })}
            </div>
          )}
      <div className="flex gap-2 pt-1">
  <button className="inline-flex items-center justify-center rounded border border-slate-300 px-2 py-1 text-[11px] bg-white hover:bg-slate-50 active:bg-slate-100 shadow-sm" onClick={()=>onDuplicate(field)}>Duplicate</button>
  <button className="inline-flex items-center justify-center rounded border border-red-500 px-2 py-1 text-[11px] bg-red-500 text-white hover:bg-red-600 active:bg-red-500 shadow-sm" onClick={()=>onDelete(field.id)}>Delete</button>
      </div>
    </div>
  );
}
