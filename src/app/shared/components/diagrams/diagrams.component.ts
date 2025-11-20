import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';
import {
  DiagramComponent as SyncfusionDiagramComponent,
  NodeModel,
  ConnectorModel,
  ShapeAnnotationModel,
  PointModel
} from '@syncfusion/ej2-angular-diagrams';

export interface DiagramsConfig {
  nodes?: NodeModel[];
  connectors?: ConnectorModel[];
  pageSettings?: any;
  snapSettings?: any;
  rulerSettings?: any;
  // Note: background is not a direct input property, it's controlled via CSS
  layout?: any;
  dataSourceSettings?: any;
  selectedItems?: any;
  constraints?: any;
  tool?: any;
  drawingObject?: any;
  height?: string | number;
  width?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-diagrams',
  standalone: true,
  imports: [CommonModule, DiagramModule],
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.scss']
})
export class DiagramsComponent implements OnInit, OnDestroy {
  @ViewChild('diagram', { static: false }) diagram!: SyncfusionDiagramComponent;

  // Data
  @Input() nodes: NodeModel[] = [];
  @Input() connectors: ConnectorModel[] = [];

  // Settings
  @Input() pageSettings: any = {
    width: 1000,
    height: 1000,
    orientation: 'Landscape',
    showPageBreaks: false
  };
  @Input() snapSettings: any = {
    horizontalGridlines: { lineColor: '#e0e0e0' },
    verticalGridlines: { lineColor: '#e0e0e0' },
    constraints: 0
  };
  @Input() rulerSettings: any = {
    showRulers: true
  };
  // Note: background is not a direct input property, it's controlled via CSS
  @Input() layout: any = {
    type: 'None'
  };
  @Input() dataSourceSettings: any = {};
  @Input() selectedItems: any = {
    constraints: 0
  };
  @Input() constraints: any = 0;
  @Input() tool: any = 'Default';
  @Input() drawingObject: any = {};

  // Size
  @Input() height: string | number = '600px';
  @Input() width: string | number = '100%';
  @Input() customClass?: string;

  // Events
  @Output() created = new EventEmitter<any>();
  @Output() nodeClick = new EventEmitter<any>();
  @Output() connectorClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() scrollChange = new EventEmitter<any>();
  @Output() zoomChange = new EventEmitter<any>();
  @Output() historyChange = new EventEmitter<any>();
  @Output() objectDoubleClick = new EventEmitter<any>();
  @Output() textEdit = new EventEmitter<any>();
  @Output() dragEnter = new EventEmitter<any>();
  @Output() dragLeave = new EventEmitter<any>();
  @Output() dragOver = new EventEmitter<any>();
  @Output() drop = new EventEmitter<any>();

  ngOnInit(): void {
    // Initialize if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get diagram instance
   */
  getDiagramInstance(): SyncfusionDiagramComponent | null {
    return this.diagram || null;
  }

  /**
   * Add node
   */
  addNode(node: NodeModel): void {
    if (this.diagram) {
      this.diagram.add(node);
    }
  }

  /**
   * Add connector
   */
  addConnector(connector: ConnectorModel): void {
    if (this.diagram) {
      this.diagram.add(connector);
    }
  }

  /**
   * Remove node
   */
  removeNode(nodeId: string): void {
    if (this.diagram) {
      const node = this.diagram.nodes.find((n: any) => n.id === nodeId);
      if (node) {
        this.diagram.remove(node);
      }
    }
  }

  /**
   * Remove connector
   */
  removeConnector(connectorId: string): void {
    if (this.diagram) {
      const connector = this.diagram.connectors.find((c: any) => c.id === connectorId);
      if (connector) {
        this.diagram.remove(connector);
      }
    }
  }

  /**
   * Clear diagram
   */
  clear(): void {
    if (this.diagram) {
      this.diagram.clear();
    }
  }

  /**
   * Select all
   */
  selectAll(): void {
    if (this.diagram) {
      this.diagram.selectAll();
    }
  }

  /**
   * Unselect all
   */
  unselectAll(): void {
    if (this.diagram) {
      this.diagram.clearSelection();
    }
  }

  /**
   * Copy
   */
  copy(): void {
    if (this.diagram) {
      this.diagram.copy();
    }
  }

  /**
   * Paste
   */
  paste(): void {
    if (this.diagram) {
      this.diagram.paste();
    }
  }

  /**
   * Cut
   */
  cut(): void {
    if (this.diagram) {
      this.diagram.cut();
    }
  }

  /**
   * Undo
   */
  undo(): void {
    if (this.diagram) {
      this.diagram.undo();
    }
  }

  /**
   * Redo
   */
  redo(): void {
    if (this.diagram) {
      this.diagram.redo();
    }
  }

  /**
   * Zoom in
   */
  zoomIn(): void {
    if (this.diagram) {
      this.diagram.zoomTo({ type: 'ZoomIn' });
    }
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    if (this.diagram) {
      this.diagram.zoomTo({ type: 'ZoomOut' });
    }
  }

  /**
   * Fit to page
   */
  fitToPage(): void {
    if (this.diagram) {
      // Use fitToPage with options
      (this.diagram as any).fitToPage({ mode: 'Page', region: 'Content' });
    }
  }

  /**
   * Reset zoom
   */
  resetZoom(): void {
    if (this.diagram) {
      // Use reset method
      (this.diagram as any).reset();
    }
  }

  /**
   * Export as image
   */
  exportImage(fileName?: string): void {
    if (this.diagram) {
      // Use exportDiagram with options
      (this.diagram as any).exportDiagram({ format: 'PNG', fileName: fileName || 'Diagram' });
    }
  }

  /**
   * Export as SVG
   */
  exportSvg(fileName?: string): void {
    if (this.diagram) {
      // Use exportDiagram with options
      (this.diagram as any).exportDiagram({ format: 'SVG', fileName: fileName || 'Diagram' });
    }
  }

  /**
   * Print
   */
  print(): void {
    if (this.diagram) {
      // Use print method
      (this.diagram as any).print();
    }
  }

  /**
   * Load diagram from JSON
   */
  loadDiagram(jsonData: any): void {
    if (this.diagram) {
      this.diagram.loadDiagram(JSON.stringify(jsonData));
    }
  }

  /**
   * Save diagram as JSON
   */
  saveDiagram(): any {
    if (this.diagram) {
      return JSON.parse(this.diagram.saveDiagram());
    }
    return null;
  }

  /**
   * Get selected nodes
   */
  getSelectedNodes(): NodeModel[] {
    if (this.diagram) {
      return this.diagram.selectedItems.nodes || [];
    }
    return [];
  }

  /**
   * Get selected connectors
   */
  getSelectedConnectors(): ConnectorModel[] {
    if (this.diagram) {
      return this.diagram.selectedItems.connectors || [];
    }
    return [];
  }

  /**
   * Refresh
   */
  refresh(): void {
    if (this.diagram) {
      this.diagram.dataBind();
    }
  }

  /**
   * Event handlers
   */
  onCreated(event: any): void {
    this.created.emit(event);
  }

  onNodeClick(event: any): void {
    this.nodeClick.emit(event);
  }

  onConnectorClick(event: any): void {
    this.connectorClick.emit(event);
  }

  onSelectionChange(event: any): void {
    this.selectionChange.emit(event);
  }

  onScrollChange(event: any): void {
    this.scrollChange.emit(event);
  }

  onZoomChange(event: any): void {
    this.zoomChange.emit(event);
  }

  onHistoryChange(event: any): void {
    this.historyChange.emit(event);
  }

  onObjectDoubleClick(event: any): void {
    this.objectDoubleClick.emit(event);
  }

  onTextEdit(event: any): void {
    this.textEdit.emit(event);
  }

  onDragEnter(event: any): void {
    this.dragEnter.emit(event);
  }

  onDragLeave(event: any): void {
    this.dragLeave.emit(event);
  }

  onDragOver(event: any): void {
    this.dragOver.emit(event);
  }

  onDrop(event: any): void {
    this.drop.emit(event);
  }
}

