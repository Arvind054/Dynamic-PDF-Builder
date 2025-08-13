// Different Data Field Component in Editor page
import React, { useRef, useState, useEffect } from 'react';
import { FieldType } from '../model/fieldTypes';

function clamp(v, min, max){ return Math.min(Math.max(v, min), max); }

export default function FieldBox({ field, selected, onSelect, onUpdate, validateError }) {
  const boxRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const startRef = useRef(null);
  const [local, setLocal] = useState({ x: field.x, y: field.y, w: field.width, h: field.height, r: field.rotation||0 });

  useEffect(()=> { setLocal(l => ({ ...l, x: field.x, y: field.y })); }, [field.x, field.y]);
  useEffect(()=> { setLocal(l => ({ ...l, w: field.width, h: field.height })); }, [field.width, field.height]);
  useEffect(()=> { setLocal(l => ({ ...l, r: field.rotation||0 })); }, [field.rotation]);

  const beginDrag = (e) => {
    e.stopPropagation();
    onSelect(field.id);
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY, fx: local.x, fy: local.y };
  };
  const beginResize = (e) => {
    e.stopPropagation();
    onSelect(field.id);
    setResizing(true);
    startRef.current = { x: e.clientX, y: e.clientY, fw: local.w, fh: local.h };
  };
  const beginRotate = (e) => {
    e.stopPropagation();
    onSelect(field.id);
    startRef.current = { x: e.clientX, r: local.r };
    const move = (ev) => {
      const delta = ev.clientX - startRef.current.x;
      setLocal(l => ({ ...l, r: (startRef.current.r + delta) % 360 }));
    };
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); onUpdate(field.id, { rotation: local.r }); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  useEffect(()=> {
    const move = (e) => {
      if(!startRef.current) return;
      const parent = boxRef.current?.parentElement;
      if(!parent) return;
      const pw = parent.clientWidth; const ph = parent.clientHeight;
      if (dragging){
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        const nx = clamp(startRef.current.fx + dx, 0, pw - local.w);
        const ny = clamp(startRef.current.fy + dy, 0, ph - local.h);
        setLocal(l => ({ ...l, x: nx, y: ny }));
      } else if (resizing){
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        const nw = clamp(startRef.current.fw + dx, 20, pw - local.x);
        const nh = clamp(startRef.current.fh + dy, 20, ph - local.y);
        setLocal(l => ({ ...l, w: nw, h: nh }));
      }
    };
    const up = () => {
      if(dragging) onUpdate(field.id, { x: local.x, y: local.y });
      if(resizing) onUpdate(field.id, { width: local.w, height: local.h });
      setDragging(false); setResizing(false); startRef.current = null;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragging, resizing, local.x, local.y, local.w, local.h, field.id, onUpdate]);

  const content = () => {
    switch(field.type){
      case FieldType.TEXT:
      case FieldType.DATE:
        return <div className="w-full h-full flex" style={{ alignItems:'center', justifyContent: field.style.textAlign==='right'?'flex-end':field.style.textAlign==='center'?'center':'flex-start', fontFamily: field.style.fontFamily, fontWeight: field.style.fontWeight, fontSize: field.style.fontSize, color: field.style.color, opacity: field.opacity }}>{ field.value || (field.type==='date'?'Date':'Text') }</div>;
      case FieldType.CHECKBOX:
        return <div className="flex items-center justify-center w-full h-full" style={{ fontSize: local.w-4 }}>{ field.value ? '✓' : '' }</div>;
      case FieldType.SIGNATURE:
        return <div className="text-[10px] text-slate-600">Signature</div>;
      case FieldType.IMAGE:
        return field.meta?.src ? <img src={field.meta.src} alt="img" className="w-full h-full object-contain" style={{ opacity: field.opacity }} /> : <span>Image</span>;
      case FieldType.QR:
        return field.meta?.dataUrl ? <img src={field.meta.dataUrl} alt="qr" className="w-full h-full object-contain" style={{ opacity: field.opacity }} /> : <span>QR</span>;
      case FieldType.BARCODE:
        return field.meta?.dataUrl ? <img src={field.meta.dataUrl} alt="barcode" className="w-full h-full object-contain" style={{ opacity: field.opacity }} /> : <span>Barcode</span>;
      default: return field.type;
    }
  };

  return (
    <div
      ref={boxRef}
      onMouseDown={(e)=> { beginDrag(e); }}
      className={"absolute bg-white/40 overflow-hidden " + (selected?"border-2 border-sky-600":"border border-slate-400") + (dragging?" cursor-grabbing":" cursor-grab") + (validateError?" ring-2 ring-red-500/80":"")}
      style={{ left: local.x, top: local.y, width: local.w, height: local.h, transform: `rotate(${local.r}deg)` }}
    >
      {content()}
  {validateError && <div className="absolute -top-1.5 -left-1.5 bg-red-600 text-white text-[9px] leading-none px-1.5 py-1 rounded shadow font-semibold">!</div>}
      {selected && (
        <>
          <div onMouseDown={beginRotate} className="absolute -top-6 left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center cursor-ew-resize">⟳</div>
          <div onMouseDown={beginResize} className="absolute -right-1.5 -bottom-1.5 w-[14px] h-[14px] bg-sky-600 rounded cursor-nwse-resize" />
        </>
      )}
    </div>
  );
}
