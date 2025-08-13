// Page.js
import React, { useRef, useState } from 'react';

function FieldBox({ field, selected, onSelect, onUpdate }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const startRef = useRef({});

  const onMouseDown = (e) => {
    e.stopPropagation();
    onSelect(field.id);
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY, fx: field.x, fy: field.y };
  };
  const onMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      onUpdate(field.id, { x: startRef.current.fx + dx, y: startRef.current.fy + dy });
    } else if (resizing) {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      onUpdate(field.id, { width: Math.max(20, startRef.current.fw + dx), height: Math.max(20, startRef.current.fh + dy) });
    }
  };
  const onMouseUp = () => { setDragging(false); setResizing(false); };

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    onSelect(field.id);
    setResizing(true);
    startRef.current = { x: e.clientX, y: e.clientY, fw: field.width, fh: field.height };
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  return (
    <div ref={ref} onMouseDown={onMouseDown} style={{ position:'absolute', left: field.x, top: field.y, width: field.width, height: field.height, border: selected? '2px solid #2563eb':'1px solid #64748b', background:'rgba(255,255,255,0.4)', cursor:'move', userSelect:'none', fontSize: field.style.fontSize, color: field.style.color, display:'flex', alignItems:'center', justifyContent: field.style.textAlign==='left'?'flex-start':field.style.textAlign==='right'?'flex-end':'center', padding:4 }}>
      <span style={{ pointerEvents:'none', width:'100%' }}>{field.value || field.type}</span>
      <div onMouseDown={onResizeMouseDown} style={{ position:'absolute', right:-6, bottom:-6, width:12, height:12, background:'#2563eb', borderRadius:2, cursor:'nwse-resize' }} />
    </div>
  );
}

function Page({ page, background, fields, selectedFieldId, onSelectField, onUpdateField, isActive }) {
  return (
    <div style={{ position:'relative', margin:'0 auto 24px', width:595, height:842, boxShadow: isActive? '0 0 0 3px #2563eb' : '0 0 0 1px #cbd5e1', background:'#fff', backgroundImage: background?`url(${background})`:undefined, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center' }} onMouseDown={()=>onSelectField(null)}>
      {fields.map(f => (
        <FieldBox key={f.id} field={f} selected={f.id===selectedFieldId} onSelect={onSelectField} onUpdate={onUpdateField} />
      ))}
    </div>
  );
}

export default Page;