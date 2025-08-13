import React from 'react';

export default function ThumbnailStrip({ pages, backgrounds, activePage, onSelect, onReorder }) {
  const dragPageIdRef = React.useRef(null);
  return (
  <div className="flex gap-2 overflow-x-auto py-1 px-1">
      {pages.map((p, idx) => (
        <div key={p.id}
          draggable
          onDragStart={()=> dragPageIdRef.current = p.id }
          onDragOver={e=> e.preventDefault() }
          onDrop={()=> { if(dragPageIdRef.current!==p.id){ const from = pages.findIndex(pg=>pg.id===dragPageIdRef.current); const to = pages.findIndex(pg=>pg.id===p.id); onReorder(from,to);} }}
          onClick={()=>onSelect(p.id)}
          className={"relative flex flex-none items-center justify-center text-[11px] w-20 h-28 rounded bg-white border cursor-pointer select-none transition transform " + (p.id===activePage?"border-sky-600 border-2 -translate-y-0.5 scale-105 shadow-lg":"border-slate-300 shadow hover:shadow-md hover:-translate-y-0.5") }>
      {backgrounds[p.id] ? <img src={backgrounds[p.id]} alt="thumb" className="max-w-full max-h-full" /> : `Page ${idx+1}`}
        </div>
      ))}
    </div>
  );
}
