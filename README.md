# Dynamic PDF Builder
It lets you design multi‑page PDF templates visually: add backgrounds, place and configure form fields (text, date, checkbox, signature placeholder, image, QR code, barcode), then export a vector PDF with optional AcroForm fields (editable) or a flattened version. You can also save/load templates as JSON, duplicate fields, and see a live PDF preview while editing.

## Key Features

- Multi-page layout with page thumbnails & reordering
- Image backgrounds per page (auto fit as page background)
- Drag / resize / position fields (custom implementation – no heavy external DnD libs)
- Field types: Text, Date, Checkbox, Signature (placeholder), Image, QR Code, Barcode
- Style controls (font, size, weight, alignment, color, opacity)
- Validation (required + regex pattern) indicators
- Live PDF preview (debounced) inside the editor
- Export PDF (AcroForm editable or flattened) via pdf-lib
- JSON template export/import (persist or share designs)
- Clone / delete fields quickly
- Simple, clean Tailwind-only UI

## Tech Stack

- React + Vite
- Tailwind CSS 
- pdf-lib (vector PDF generation & form fields)
- file-saver (downloads)
- qrcode & JsBarcode (QR/Barcode rendering to data URLs)

## Getting Started

### 1. Install Dependencies

```powershell
npm install
```

### 2. Run Development Server

```powershell
npm run dev
```
Open the shown local URL (default: http://localhost:5173) in your browser.


## Using the Editor

### Layout Overview

- Left Sidebar: Toolbar (add pages, upload background, add fields, import/export)
- Center: Page thumbnails (top) and the main canvas pages below
- Right Sidebar: Field Properties, Export Options, Live PDF preview
- Footer: Quick stats (page & field count)

### Typical Workflow

1. (Optional) Add a background image: Use Upload Background while a page is active.
2. Add fields: Choose a field type from the toolbar; it appears on the active page.
3. Position & resize: Drag the field; use corner handles to resize (where applicable).
4. Select field: Click it to edit properties (text, value, font, alignment, color, size, opacity, validation, etc.).
5. Duplicate or delete: Buttons inside the Field Properties panel.
6. QR / Barcode: Enter data then click generate (if implemented via a button) or update value; image previews inside the field.
7. Signature placeholder: Reserved spot (future enhancement for actual signing canvas).
8. Add more pages: Use Add Page; switch pages via thumbnails.
9. Live preview: Check the right panel to see a generated PDF snapshot (auto updates).
10. Export JSON: Save template structure for later editing.
11. Import JSON: Load a previously saved template.
12. Export PDF: Choose AcroForm (editable) and optional Flatten; click Export PDF.

### Field Styling & Validation

- Text fields: Change font size, weight, alignment, color.
- Required: Shows a validation badge if empty.
- Regex: Supply a pattern (e.g., `^\d{5}$` for a 5-digit code) to mark invalid input.

### QR & Barcode Fields

- Enter data in the value or data field (depending on UI).
- Generate to embed as an image in the final PDF.
	
## Export Options

- AcroForm: Keeps interactive form fields (editable in PDF viewers).
- Flatten: Renders content as static graphics (non-editable). If flatten is selected with AcroForm disabled, everything becomes static.




