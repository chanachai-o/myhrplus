import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramsComponent } from '../../../../shared/components/diagrams/diagrams.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';
import { NodeModel, ConnectorModel } from '@syncfusion/ej2-angular-diagrams';

@Component({
  selector: 'app-diagrams-demo',
  standalone: true,
  imports: [CommonModule, DiagramsComponent, GlassCardComponent],
  templateUrl: './diagrams-demo.component.html',
  styleUrls: ['./diagrams-demo.component.scss']
})
export class DiagramsDemoComponent {
  @ViewChild('diagram') diagram!: DiagramsComponent;

  // Sample nodes
  nodes: NodeModel[] = [
    {
      id: 'node1',
      offsetX: 100,
      offsetY: 100,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      style: { fill: '#6BA5D7', strokeColor: '#6BA5D7' },
      annotations: [{ content: 'Start' }]
    },
    {
      id: 'node2',
      offsetX: 300,
      offsetY: 100,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      style: { fill: '#6BA5D7', strokeColor: '#6BA5D7' },
      annotations: [{ content: 'Process' }]
    },
    {
      id: 'node3',
      offsetX: 500,
      offsetY: 100,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      style: { fill: '#6BA5D7', strokeColor: '#6BA5D7' },
      annotations: [{ content: 'End' }]
    }
  ];

  // Sample connectors
  connectors: ConnectorModel[] = [
    {
      id: 'connector1',
      sourceID: 'node1',
      targetID: 'node2',
      type: 'Orthogonal',
      style: { strokeColor: '#6BA5D7', strokeWidth: 2 }
    },
    {
      id: 'connector2',
      sourceID: 'node2',
      targetID: 'node3',
      type: 'Orthogonal',
      style: { strokeColor: '#6BA5D7', strokeWidth: 2 }
    }
  ];

  // Methods
  addNode(): void {
    const newNode: NodeModel = {
      id: `node${this.nodes.length + 1}`,
      offsetX: 200 + (this.nodes.length * 150),
      offsetY: 200,
      width: 100,
      height: 50,
      shape: { type: 'Basic', shape: 'Rectangle' },
      style: { fill: '#6BA5D7', strokeColor: '#6BA5D7' },
      annotations: [{ content: `Node ${this.nodes.length + 1}` }]
    };
    this.diagram?.addNode(newNode);
    this.nodes.push(newNode);
  }

  addConnector(): void {
    if (this.nodes.length >= 2) {
      const newConnector: ConnectorModel = {
        id: `connector${this.connectors.length + 1}`,
        sourceID: this.nodes[this.nodes.length - 2].id as string,
        targetID: this.nodes[this.nodes.length - 1].id as string,
        type: 'Orthogonal',
        style: { strokeColor: '#6BA5D7', strokeWidth: 2 }
      };
      this.diagram?.addConnector(newConnector);
      this.connectors.push(newConnector);
    }
  }

  clearDiagram(): void {
    this.diagram?.clear();
    this.nodes = [];
    this.connectors = [];
  }

  selectAll(): void {
    this.diagram?.selectAll();
  }

  unselectAll(): void {
    this.diagram?.unselectAll();
  }

  copy(): void {
    this.diagram?.copy();
  }

  paste(): void {
    this.diagram?.paste();
  }

  cut(): void {
    this.diagram?.cut();
  }

  undo(): void {
    this.diagram?.undo();
  }

  redo(): void {
    this.diagram?.redo();
  }

  zoomIn(): void {
    this.diagram?.zoomIn();
  }

  zoomOut(): void {
    this.diagram?.zoomOut();
  }

  fitToPage(): void {
    this.diagram?.fitToPage();
  }

  resetZoom(): void {
    this.diagram?.resetZoom();
  }

  exportImage(): void {
    this.diagram?.exportImage('Diagram');
  }

  exportSvg(): void {
    this.diagram?.exportSvg('Diagram');
  }

  print(): void {
    this.diagram?.print();
  }

  saveDiagram(): void {
    const data = this.diagram?.saveDiagram();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  loadSampleDiagram(): void {
    this.nodes = [
      {
        id: 'node1',
        offsetX: 100,
        offsetY: 100,
        width: 100,
        height: 50,
        shape: { type: 'Basic', shape: 'Rectangle' },
        style: { fill: '#6BA5D7', strokeColor: '#6BA5D7' },
        annotations: [{ content: 'Start' }]
      },
      {
        id: 'node2',
        offsetX: 300,
        offsetY: 100,
        width: 100,
        height: 50,
        shape: { type: 'Basic', shape: 'Rectangle' },
        style: { fill: '#6BA5D7', strokeColor: '#6BA5D7' },
        annotations: [{ content: 'Process' }]
      },
      {
        id: 'node3',
        offsetX: 500,
        offsetY: 100,
        width: 100,
        height: 50,
        shape: { type: 'Basic', shape: 'Rectangle' },
        style: { fill: '#6BA5D7', strokeColor: '#6BA5D7' },
        annotations: [{ content: 'End' }]
      }
    ];
    this.connectors = [
      {
        id: 'connector1',
        sourceID: 'node1',
        targetID: 'node2',
        type: 'Orthogonal',
        style: { strokeColor: '#6BA5D7', strokeWidth: 2 }
      },
      {
        id: 'connector2',
        sourceID: 'node2',
        targetID: 'node3',
        type: 'Orthogonal',
        style: { strokeColor: '#6BA5D7', strokeWidth: 2 }
      }
    ];
    this.diagram?.refresh();
  }
}

