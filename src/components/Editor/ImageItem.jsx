// ImageItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

function ImageItem({ image }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { id: image.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: image.x,
        top: image.y,
        width: image.width,
        height: image.height,
        border: isDragging ? '2px dashed black' : '1px solid gray',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <img 
        src={image.src} 
        alt="Draggable" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
      />
    </div>
  );
}

export default ImageItem; 