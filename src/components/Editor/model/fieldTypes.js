// Different Fields for the data Types to be inserted in PDF
export const FieldType = {
  TEXT: 'text',
  DATE: 'date',
  CHECKBOX: 'checkbox',
  SIGNATURE: 'signature',
  IMAGE: 'image',
  QR: 'qr',
  BARCODE: 'barcode'
};

// Function to add fields to the PDF
export function createField(type, overrides = {}) {
  const base = {
    id: crypto.randomUUID(),
    type,
    pageId: 1,
    x: 50,
    y: 50,
    width: 150,
    height: 40,
    rotation: 0,
    opacity: 1,
    style: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'left'
    },
    value: '',
    required: false,
    validation: { regex: '', min: undefined, max: undefined },
    meta: {}
  };
  switch(type) {
    case FieldType.CHECKBOX:
      base.width = 20; base.height = 20; base.value = false; break;
    case FieldType.SIGNATURE:
      base.height = 120; base.meta = { strokes: [] }; break;
    case FieldType.IMAGE:
      base.height = 120; base.meta = { src: '' }; break;
    case FieldType.QR:
    case FieldType.BARCODE:
      base.height = 120; base.meta = { data: '' }; break;
    case FieldType.DATE:
      base.value = new Date().toISOString().substring(0,10); break;
    default:
      break;
  }
  return { ...base, ...overrides };
}

// To Duplicate a Data Field
export function cloneField(field, overrides={}) {
  return { ...field, id: crypto.randomUUID(), ...overrides };
}

// To serialize & deserialize 
export function serializeTemplate(pages, backgrounds, fields) {
  return JSON.stringify({ version: 1, pages, backgrounds, fields }, null, 2);
}

export function deserializeTemplate(json) {
  const data = JSON.parse(json);
  return data;
}
