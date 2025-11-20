# 📊 Diagrams Component Summary

**Component**: `app-diagrams`  
**Library**: Syncfusion Diagrams  
**Type**: Standalone Component

---

## 🎯 Overview

`DiagramsComponent` เป็น wrapper component สำหรับ Syncfusion Diagrams ที่ให้ความสามารถในการสร้างและจัดการ diagrams เช่น flowcharts, organizational charts, network diagrams

---

## ✨ Key Features

- ✅ Flowcharts and organizational charts
- ✅ Network diagrams and mind maps
- ✅ BPMN and UML diagrams
- ✅ Node and connector creation
- ✅ Drag and drop support
- ✅ Zoom and pan
- ✅ Undo/Redo functionality
- ✅ Copy/Paste operations
- ✅ Export (Image, SVG)
- ✅ Print support
- ✅ Grid and ruler settings
- ✅ Layout algorithms
- ✅ Data binding support
- ✅ Glass Morphism styling
- ✅ Dark Mode support

---

## 🚀 Quick Start

### Installation

Component ใช้ Syncfusion Diagrams ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-diagrams": "^29.2.x"
```

### Basic Usage

```html
<app-diagrams
  [nodes]="nodes"
  [connectors]="connectors"
  [height]="'600px'"
  [width]="'100%'">
</app-diagrams>
```

```typescript
import { DiagramsComponent } from '../../shared/components/diagrams/diagrams.component';
import { NodeModel, ConnectorModel } from '@syncfusion/ej2-angular-diagrams';

export class ExampleComponent {
  nodes: NodeModel[] = [
    {
      id: 'node1',
      offsetX: 100,
      offsetY: 100,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: [{ content: 'Node 1' }]
    }
  ];

  connectors: ConnectorModel[] = [];
}
```

---

## 📋 Main Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `nodes` | `NodeModel[]` | `[]` | Array of nodes |
| `connectors` | `ConnectorModel[]` | `[]` | Array of connectors |
| `pageSettings` | `any` | `{ width: 1000, height: 1000 }` | Page settings |
| `snapSettings` | `any` | `{ ... }` | Snap settings |
| `rulerSettings` | `any` | `{ showRulers: true }` | Ruler settings |
| `height` | `string \| number` | `'600px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |

---

## 🔧 Main Methods

| Method | Description |
|--------|-------------|
| `addNode(node)` | Add node to diagram |
| `addConnector(connector)` | Add connector to diagram |
| `removeNode(nodeId)` | Remove node |
| `removeConnector(connectorId)` | Remove connector |
| `clear()` | Clear all nodes and connectors |
| `selectAll()` | Select all items |
| `unselectAll()` | Unselect all items |
| `copy()` | Copy selected items |
| `paste()` | Paste copied items |
| `cut()` | Cut selected items |
| `undo()` | Undo last action |
| `redo()` | Redo last undone action |
| `zoomIn()` | Zoom in |
| `zoomOut()` | Zoom out |
| `fitToPage()` | Fit to page |
| `resetZoom()` | Reset zoom |
| `exportImage(fileName?)` | Export as image |
| `exportSvg(fileName?)` | Export as SVG |
| `print()` | Print diagram |
| `loadDiagram(jsonData)` | Load from JSON |
| `saveDiagram()` | Save as JSON |
| `getSelectedNodes()` | Get selected nodes |
| `getSelectedConnectors()` | Get selected connectors |

---

## 📤 Main Events

| Event | Description |
|-------|-------------|
| `created` | Emitted when diagram is created |
| `nodeClick` | Emitted when node is clicked |
| `connectorClick` | Emitted when connector is clicked |
| `selectionChange` | Emitted when selection changes |
| `zoomChange` | Emitted when zoom changes |
| `historyChange` | Emitted when history changes |
| `objectDoubleClick` | Emitted when object is double-clicked |

---

## 💡 Common Use Cases

### 1. Basic Flowchart

```html
<app-diagrams
  #diagram
  [nodes]="nodes"
  [connectors]="connectors">
</app-diagrams>
```

### 2. Add Node Programmatically

```typescript
@ViewChild('diagram') diagram!: DiagramsComponent;

addNode(): void {
  const newNode: NodeModel = {
    id: 'newNode',
    offsetX: 200,
    offsetY: 200,
    width: 100,
    height: 50,
    shape: { type: 'Basic', shape: 'Rectangle' },
    annotations: [{ content: 'New Node' }]
  };
  this.diagram.addNode(newNode);
}
```

### 3. Export Diagram

```typescript
exportImage(): void {
  this.diagram.exportImage('MyDiagram');
}

exportSvg(): void {
  this.diagram.exportSvg('MyDiagram');
}
```

### 4. Save and Load

```typescript
saveDiagram(): void {
  const data = this.diagram.saveDiagram();
  // Save to server or localStorage
}

loadDiagram(jsonData: any): void {
  this.diagram.loadDiagram(jsonData);
}
```

### 5. Zoom Control

```typescript
zoomIn(): void {
  this.diagram.zoomIn();
}

fitToPage(): void {
  this.diagram.fitToPage();
}
```

---

## 🎨 Styling

Component ใช้ Glass Morphism styling โดยอัตโนมัติและรองรับ Dark Mode

```scss
.diagrams-container {
  ::ng-deep {
    .e-diagram {
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
    }
  }
}
```

---

## 📝 Notes

- Diagrams component ต้องการ Syncfusion Diagrams module
- Nodes และ connectors ต้องมี unique IDs
- Layout algorithms ต้องใช้กับ data binding
- Export features ต้องใช้ browser APIs ที่รองรับ

---

## 🔗 Related Components

- `ChartComponent` - สำหรับแสดงกราฟและข้อมูล
- `DataGridComponent` - สำหรับแสดงข้อมูลแบบตาราง

---

**Last Updated**: 2024-12-20

