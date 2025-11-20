# 📊 Diagrams Component Guide

**วันที่สร้าง**: 2024-12-20  
**Component**: `app-diagrams`  
**Library**: Syncfusion Diagrams

---

## 📋 สารบัญ

1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Styling](#styling)

---

## 🎯 Overview

`DiagramsComponent` เป็น wrapper component สำหรับ Syncfusion Diagrams ที่ให้ความสามารถในการสร้างและจัดการ diagrams เช่น flowcharts, organizational charts, network diagrams พร้อม Glass Morphism styling และ Gemini theme support

### Features
- ✅ Flowcharts & Organizational Charts
- ✅ Network Diagrams & Mind Maps
- ✅ BPMN Diagrams
- ✅ UML Diagrams
- ✅ Node & Connector Creation
- ✅ Drag & Drop Support
- ✅ Zoom & Pan
- ✅ Undo/Redo Functionality
- ✅ Copy/Paste Operations
- ✅ Export (Image, SVG)
- ✅ Print Support
- ✅ Grid & Ruler Settings
- ✅ Layout Algorithms
- ✅ Data Binding Support
- ✅ Glass Morphism styling
- ✅ Dark Mode support
- ✅ Gemini Theme support
- ✅ Responsive design

---

## 📦 Installation

### Dependencies
Component นี้ใช้ Syncfusion Diagrams ซึ่งติดตั้งแล้วในโปรเจค:
```json
"@syncfusion/ej2-angular-diagrams": "^29.2.x"
```

### Import
Component เป็น standalone component สามารถ import ได้โดยตรง:

```typescript
import { DiagramsComponent } from '../../shared/components/diagrams/diagrams.component';

@Component({
  imports: [DiagramsComponent]
})
```

---

## 🚀 Basic Usage

### Simple Example

```html
<app-diagrams
  [nodes]="nodes"
  [connectors]="connectors"
  [height]="'600px'"
  [width]="'100%'">
</app-diagrams>
```

```typescript
import { Component } from '@angular/core';
import { NodeModel, ConnectorModel } from '@syncfusion/ej2-angular-diagrams';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  nodes: NodeModel[] = [
    {
      id: 'node1',
      offsetX: 100,
      offsetY: 100,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: [{ content: 'Start' }]
    }
  ];

  connectors: ConnectorModel[] = [
    {
      id: 'connector1',
      sourceID: 'node1',
      targetID: 'node2',
      type: 'Orthogonal'
    }
  ];
}
```

---

## ⚙️ Configuration

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `nodes` | `NodeModel[]` | `[]` | Array of node models |
| `connectors` | `ConnectorModel[]` | `[]` | Array of connector models |
| `pageSettings` | `any` | `{ width: 1000, height: 1000 }` | Page settings |
| `snapSettings` | `any` | `{ horizontalGridlines: {...}, verticalGridlines: {...} }` | Snap settings |
| `rulerSettings` | `any` | `{ showRulers: true }` | Ruler settings |
| `background` | `any` | `{ color: 'transparent' }` | Background settings |
| `layout` | `any` | `{ type: 'None' }` | Layout settings |
| `dataSourceSettings` | `any` | `{}` | Data source settings |
| `selectedItems` | `any` | `{ constraints: 0 }` | Selected items settings |
| `constraints` | `any` | `0` | Diagram constraints |
| `tool` | `any` | `'Default'` | Tool type |
| `drawingObject` | `any` | `{}` | Drawing object |
| `height` | `string \| number` | `'600px'` | Component height |
| `width` | `string \| number` | `'100%'` | Component width |
| `customClass` | `string` | `undefined` | Custom CSS class |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `created` | `EventEmitter<any>` | Emitted when diagram is created |
| `nodeClick` | `EventEmitter<any>` | Emitted when node is clicked |
| `connectorClick` | `EventEmitter<any>` | Emitted when connector is clicked |
| `selectionChange` | `EventEmitter<any>` | Emitted when selection changes |
| `scrollChange` | `EventEmitter<any>` | Emitted when scroll changes |
| `zoomChange` | `EventEmitter<any>` | Emitted when zoom changes |
| `historyChange` | `EventEmitter<any>` | Emitted when history changes |
| `objectDoubleClick` | `EventEmitter<any>` | Emitted when object is double-clicked |
| `textEdit` | `EventEmitter<any>` | Emitted when text is edited |
| `dragEnter` | `EventEmitter<any>` | Emitted when drag enters |
| `dragLeave` | `EventEmitter<any>` | Emitted when drag leaves |
| `dragOver` | `EventEmitter<any>` | Emitted when drag over |
| `drop` | `EventEmitter<any>` | Emitted when drop occurs |

---

## 📚 API Reference

### Methods

#### `getDiagramInstance(): SyncfusionDiagramComponent | null`
Get the underlying Syncfusion Diagram instance.

#### `addNode(node: NodeModel): void`
Add a node to the diagram.

#### `addConnector(connector: ConnectorModel): void`
Add a connector to the diagram.

#### `removeNode(nodeId: string): void`
Remove a node from the diagram.

#### `removeConnector(connectorId: string): void`
Remove a connector from the diagram.

#### `clear(): void`
Clear all nodes and connectors.

#### `selectAll(): void`
Select all nodes and connectors.

#### `unselectAll(): void`
Unselect all nodes and connectors.

#### `copy(): void`
Copy selected items.

#### `paste(): void`
Paste copied items.

#### `cut(): void`
Cut selected items.

#### `undo(): void`
Undo last action.

#### `redo(): void`
Redo last undone action.

#### `zoomIn(): void`
Zoom in.

#### `zoomOut(): void`
Zoom out.

#### `fitToPage(): void`
Fit diagram to page.

#### `resetZoom(): void`
Reset zoom to default.

#### `exportImage(fileName?: string): void`
Export diagram as image (PNG).

#### `exportSvg(fileName?: string): void`
Export diagram as SVG.

#### `print(): void`
Print the diagram.

#### `loadDiagram(jsonData: any): void`
Load diagram from JSON data.

#### `saveDiagram(): any`
Save diagram as JSON data.

#### `getSelectedNodes(): NodeModel[]`
Get selected nodes.

#### `getSelectedConnectors(): ConnectorModel[]`
Get selected connectors.

#### `refresh(): void`
Refresh diagram.

---

## 💡 Examples

### Basic Flowchart

```html
<app-diagrams
  #diagram
  [nodes]="nodes"
  [connectors]="connectors">
</app-diagrams>
```

```typescript
export class ExampleComponent {
  nodes: NodeModel[] = [
    {
      id: 'start',
      offsetX: 100,
      offsetY: 100,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: [{ content: 'Start' }]
    },
    {
      id: 'process',
      offsetX: 300,
      offsetY: 100,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: [{ content: 'Process' }]
    }
  ];

  connectors: ConnectorModel[] = [
    {
      id: 'connector1',
      sourceID: 'start',
      targetID: 'process',
      type: 'Orthogonal'
    }
  ];
}
```

### Organizational Chart

```typescript
export class ExampleComponent {
  nodes: NodeModel[] = [
    {
      id: 'ceo',
      offsetX: 300,
      offsetY: 50,
      width: 120,
      height: 60,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: [{ content: 'CEO' }]
    },
    {
      id: 'manager1',
      offsetX: 200,
      offsetY: 150,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: [{ content: 'Manager 1' }]
    },
    {
      id: 'manager2',
      offsetX: 400,
      offsetY: 150,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: [{ content: 'Manager 2' }]
    }
  ];

  connectors: ConnectorModel[] = [
    {
      id: 'connector1',
      sourceID: 'ceo',
      targetID: 'manager1',
      type: 'Orthogonal'
    },
    {
      id: 'connector2',
      sourceID: 'ceo',
      targetID: 'manager2',
      type: 'Orthogonal'
    }
  ];
}
```

### Programmatic Control

```typescript
export class ExampleComponent {
  @ViewChild('diagram') diagram!: DiagramsComponent;

  addNewNode(): void {
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

  exportDiagram(): void {
    this.diagram.exportImage('MyDiagram');
  }

  saveDiagram(): void {
    const data = this.diagram.saveDiagram();
    // Save to server or localStorage
  }
}
```

### Layout Algorithms

```typescript
export class ExampleComponent {
  layout: any = {
    type: 'HierarchicalTree',
    orientation: 'TopToBottom',
    horizontalSpacing: 30,
    verticalSpacing: 30
  };
}
```

---

## 🎨 Styling

### Glass Morphism

Component ใช้ Glass Morphism styling โดยอัตโนมัติ:

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

### Dark Mode

Component รองรับ Dark Mode โดยอัตโนมัติ:

```scss
:host-context(.dark) {
  .diagrams-container {
    ::ng-deep {
      .e-diagram {
        border-color: rgba(148, 163, 184, 0.3);
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
```

### Custom Styling

คุณสามารถ override styles ได้โดยใช้ `::ng-deep`:

```scss
::ng-deep {
  .e-diagram {
    // Custom styles
  }
}
```

---

## 🔧 Advanced Usage

### Event Handling

```typescript
export class ExampleComponent {
  onNodeClick(event: any): void {
    console.log('Node clicked:', event);
  }

  onSelectionChange(event: any): void {
    console.log('Selection changed:', event);
  }
}
```

```html
<app-diagrams
  (nodeClick)="onNodeClick($event)"
  (selectionChange)="onSelectionChange($event)">
</app-diagrams>
```

### Data Binding

```typescript
export class ExampleComponent {
  dataSource: any[] = [
    { id: '1', name: 'Node 1', parentId: null },
    { id: '2', name: 'Node 2', parentId: '1' }
  ];

  dataSourceSettings: any = {
    id: 'id',
    parentId: 'parentId',
    dataSource: this.dataSource
  };
}
```

---

## 📝 Notes

- Diagrams component ต้องการ Syncfusion Diagrams module ที่ติดตั้งแล้ว
- Nodes และ connectors ต้องมี unique IDs
- Layout algorithms ต้องใช้กับ data binding
- Export features ต้องใช้ browser APIs ที่รองรับ
- Print functionality ใช้ browser print dialog

---

## 🔗 Related Documentation

- [Syncfusion Diagrams Documentation](https://ej2.syncfusion.com/angular/documentation/diagram/getting-started/)
- [Syncfusion Diagrams API Reference](https://ej2.syncfusion.com/angular/documentation/api/diagram/)

---

**Last Updated**: 2024-12-20

