# Gantt Chart Component Guide

## Overview

The `GanttComponent` is a wrapper around Syncfusion's Gantt Chart component, providing a powerful project management tool for displaying and managing tasks in a timeline view. It supports task dependencies, resource allocation, progress tracking, and various export options.

## Installation

The Gantt component is part of the Syncfusion gantt package and is already included in the `SyncfusionModule`. No additional installation is required.

## Basic Usage

```typescript
import { GanttComponent, GanttTask, GanttColumn } from '@shared/components/gantt/gantt.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [GanttComponent],
  template: `
    <app-gantt
      [dataSource]="ganttData"
      [taskFields]="taskFields"
      [columns]="columns"
      [height]="'600px'">
    </app-gantt>
  `
})
export class ExampleComponent {
  ganttData: GanttTask[] = [
    {
      taskID: 1,
      taskName: 'Project Planning',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      duration: 15,
      progress: 100
    }
  ];

  taskFields: any = {
    id: 'taskID',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    child: 'subtasks'
  };

  columns: GanttColumn[] = [
    { field: 'taskID', headerText: 'ID', width: 80 },
    { field: 'taskName', headerText: 'Task Name', width: 250 },
    { field: 'startDate', headerText: 'Start Date', width: 120 },
    { field: 'endDate', headerText: 'End Date', width: 120 },
    { field: 'duration', headerText: 'Duration', width: 100 },
    { field: 'progress', headerText: 'Progress', width: 100 }
  ];
}
```

## Inputs

### Data Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dataSource` | `GanttTask[]` | `[]` | Array of tasks to display in the Gantt chart |
| `taskFields` | `any` | `{...}` | Field mappings for task properties |
| `columns` | `GanttColumn[]` | `[]` | Column definitions for the grid |
| `config` | `GanttConfig` | `undefined` | Configuration object to set multiple properties at once |

### Behavior Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `allowSelection` | `boolean` | `true` | Enable/disable row selection |
| `allowSorting` | `boolean` | `true` | Enable/disable column sorting |
| `allowFiltering` | `boolean` | `true` | Enable/disable filtering |
| `allowResizing` | `boolean` | `true` | Enable/disable column resizing |
| `allowReordering` | `boolean` | `true` | Enable/disable column reordering |
| `allowEditing` | `boolean` | `true` | Enable/disable task editing |
| `allowTaskbarDragDrop` | `boolean` | `true` | Enable/disable drag and drop of taskbars |
| `allowTaskbarResize` | `boolean` | `true` | Enable/disable resizing of taskbars |

### Toolbar Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableToolbar` | `boolean` | `false` | Enable/disable toolbar |
| `toolbar` | `string[]` | `[...]` | Array of toolbar items to display |

### Export Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `allowExcelExport` | `boolean` | `false` | Enable/disable Excel export |
| `allowPdfExport` | `boolean` | `false` | Enable/disable PDF export |

### Advanced Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableCriticalPath` | `boolean` | `false` | Enable/disable critical path calculation |
| `timelineSettings` | `any` | `{}` | Timeline view settings |
| `labelSettings` | `any` | `{}` | Task label settings |
| `splitterSettings` | `any` | `{ position: '50%' }` | Splitter position settings |
| `projectStartDate` | `Date \| string` | `undefined` | Project start date |
| `projectEndDate` | `Date \| string` | `undefined` | Project end date |
| `workWeek` | `number[]` | `[0,1,2,3,4]` | Working days (0=Sunday, 6=Saturday) |
| `holidays` | `any[]` | `[]` | Array of holidays |
| `eventMarkers` | `any[]` | `[]` | Array of event markers |

### Appearance Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `height` | `string \| number` | `'450px'` | Height of the Gantt chart |
| `width` | `string \| number` | `'100%'` | Width of the Gantt chart |
| `enableRtl` | `boolean` | `false` | Enable/disable right-to-left layout |
| `locale` | `string` | `'en'` | Locale for localization |
| `customClass` | `string` | `undefined` | Custom CSS class for the container |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `actionBegin` | `EventEmitter<any>` | Emitted when an action begins |
| `actionComplete` | `EventEmitter<any>` | Emitted when an action completes |
| `cellEdit` | `EventEmitter<any>` | Emitted when a cell is edited |
| `taskbarEdited` | `EventEmitter<any>` | Emitted when a taskbar is edited |
| `rowSelected` | `EventEmitter<any>` | Emitted when a row is selected |
| `rowDeselected` | `EventEmitter<any>` | Emitted when a row is deselected |
| `dataBound` | `EventEmitter<any>` | Emitted when data is bound |
| `created` | `EventEmitter<any>` | Emitted when Gantt is created |

## Methods

### Navigation Methods

```typescript
// Expand all tasks
expandAll(): void

// Collapse all tasks
collapseAll(): void

// Expand task by index
expandByIndex(index: number): void

// Collapse task by index
collapseByIndex(index: number): void
```

### Selection Methods

```typescript
// Get selected rows
getSelectedRows(): any[]

// Select row by index
selectRow(index: number): void

// Clear selection
clearSelection(): void
```

### Search Methods

```typescript
// Search tasks
search(searchText: string): void

// Clear search
clearSearch(): void
```

### Zoom Methods

```typescript
// Zoom in
zoomIn(): void

// Zoom out
zoomOut(): void

// Zoom to fit project
zoomToFit(): void

// Navigate to previous time span
previousTimeSpan(): void

// Navigate to next time span
nextTimeSpan(): void
```

### Export Methods

```typescript
// Export to Excel
exportToExcel(fileName?: string): void

// Export to PDF
exportToPdf(fileName?: string): void

// Export to CSV
exportToCsv(fileName?: string): void
```

### CRUD Methods

```typescript
// Add new task
addRecord(data?: GanttTask, rowIndex?: number): void

// Update task
updateRecord(field: string, data: GanttTask, rowIndex: number): void

// Delete task
deleteRecord(rowIndex: number): void
```

### Utility Methods

```typescript
// Refresh Gantt
refresh(): void

// Get Gantt instance
getGanttInstance(): SyncfusionGanttComponent | null
```

## GanttTask Interface

```typescript
interface GanttTask {
  taskID: number;                    // Unique task identifier
  taskName: string;                   // Task name
  startDate?: Date | string;          // Start date
  endDate?: Date | string;            // End date
  duration?: number;                  // Duration in days
  progress?: number;                   // Progress percentage (0-100)
  dependency?: string;                 // Task dependency (e.g., "2")
  resourceID?: number | number[];      // Resource IDs
  baselineStartDate?: Date | string;   // Baseline start date
  baselineEndDate?: Date | string;     // Baseline end date
  notes?: string;                      // Task notes
  subtasks?: GanttTask[];              // Child tasks
  [key: string]: any;                  // Additional properties
}
```

## GanttColumn Interface

```typescript
interface GanttColumn {
  field: string;                       // Field name from data source
  headerText?: string;                 // Column header text
  width?: number | string;             // Column width
  textAlign?: 'Left' | 'Right' | 'Center'; // Text alignment
  format?: string;                     // Format string (for dates/numbers)
  type?: 'string' | 'number' | 'date' | 'boolean'; // Column type
  visible?: boolean;                   // Column visibility
  [key: string]: any;                  // Additional properties
}
```

## Examples

### Basic Gantt Chart

```typescript
export class MyComponent {
  ganttData: GanttTask[] = [
    {
      taskID: 1,
      taskName: 'Planning',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      duration: 15,
      progress: 100
    },
    {
      taskID: 2,
      taskName: 'Development',
      startDate: new Date('2024-01-16'),
      endDate: new Date('2024-02-15'),
      duration: 30,
      progress: 60
    }
  ];

  taskFields: any = {
    id: 'taskID',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress'
  };
}
```

```html
<app-gantt
  [dataSource]="ganttData"
  [taskFields]="taskFields"
  [height]="'600px'">
</app-gantt>
```

### Gantt Chart with Subtasks

```typescript
export class MyComponent {
  ganttData: GanttTask[] = [
    {
      taskID: 1,
      taskName: 'Project Planning',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      duration: 15,
      progress: 100,
      subtasks: [
        {
          taskID: 2,
          taskName: 'Requirement Analysis',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-05'),
          duration: 5,
          progress: 100
        },
        {
          taskID: 3,
          taskName: 'Resource Planning',
          startDate: new Date('2024-01-06'),
          endDate: new Date('2024-01-10'),
          duration: 5,
          progress: 100
        }
      ]
    }
  ];

  taskFields: any = {
    id: 'taskID',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    child: 'subtasks'
  };
}
```

### Gantt Chart with Dependencies

```typescript
export class MyComponent {
  ganttData: GanttTask[] = [
    {
      taskID: 1,
      taskName: 'Planning',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      duration: 15,
      progress: 100
    },
    {
      taskID: 2,
      taskName: 'Development',
      startDate: new Date('2024-01-16'),
      endDate: new Date('2024-02-15'),
      duration: 30,
      progress: 60,
      dependency: '1' // Depends on task 1
    }
  ];

  taskFields: any = {
    id: 'taskID',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    dependency: 'dependency'
  };
}
```

### Gantt Chart with Toolbar and Export

```html
<app-gantt
  [dataSource]="ganttData"
  [taskFields]="taskFields"
  [columns]="columns"
  [enableToolbar]="true"
  [allowExcelExport]="true"
  [allowPdfExport]="true"
  [height]="'600px'">
</app-gantt>
```

### Programmatic Control

```typescript
export class MyComponent {
  @ViewChild('gantt') gantt!: GanttComponent;

  exportData(): void {
    this.gantt.exportToExcel('ProjectTimeline');
  }

  expandAllTasks(): void {
    this.gantt.expandAll();
  }

  onRowSelected(event: any): void {
    console.log('Selected task:', event);
  }
}
```

```html
<app-gantt
  #gantt
  [dataSource]="ganttData"
  [taskFields]="taskFields"
  (rowSelected)="onRowSelected($event)">
</app-gantt>

<button (click)="exportData()">Export Excel</button>
<button (click)="expandAllTasks()">Expand All</button>
```

### Using Configuration Object

```typescript
export class MyComponent {
  ganttConfig: GanttConfig = {
    dataSource: [
      { taskID: 1, taskName: 'Task 1', startDate: new Date('2024-01-01'), duration: 10, progress: 50 }
    ],
    taskFields: {
      id: 'taskID',
      name: 'taskName',
      startDate: 'startDate',
      duration: 'duration',
      progress: 'progress'
    },
    columns: [
      { field: 'taskID', headerText: 'ID', width: 80 },
      { field: 'taskName', headerText: 'Task Name', width: 250 }
    ],
    allowSelection: true,
    allowSorting: true,
    enableToolbar: true,
    height: '600px',
    width: '100%'
  };
}
```

```html
<app-gantt [config]="ganttConfig"></app-gantt>
```

## Styling

The component uses Glass Morphism styling by default and supports dark mode. You can customize the appearance using:

1. **Custom CSS Classes**: Use `customClass` for container styling
2. **SCSS Variables**: Override design tokens in `src/styles/_design-tokens.scss`

### Custom Styling Example

```scss
// component.scss
.my-gantt {
  ::ng-deep {
    .e-gantt {
      .e-taskbar {
        fill: rgba(79, 70, 229, 0.8);
      }
    }
  }
}
```

```html
<app-gantt
  [dataSource]="ganttData"
  [taskFields]="taskFields"
  customClass="my-gantt">
</app-gantt>
```

## Best Practices

1. **Data Structure**: Ensure tasks have unique `taskID` values
2. **Performance**: Limit the number of tasks for better performance (recommended: < 1000 tasks)
3. **Dependencies**: Use task IDs for dependencies (e.g., `dependency: '2'`)
4. **Progress**: Keep progress values between 0-100
5. **Dates**: Use Date objects or ISO date strings
6. **Subtasks**: Use `subtasks` array for hierarchical tasks
7. **Columns**: Define columns based on your data structure
8. **Export**: Enable export services only when needed

## Troubleshooting

### Gantt Not Displaying

- Ensure `dataSource` array is not empty
- Check that `taskFields` are correctly mapped
- Verify `height` and `width` are set correctly
- Verify `GanttModule` is imported in your module

### Tasks Not Showing

- Check that `taskFields` match your data structure
- Verify dates are valid Date objects or ISO strings
- Ensure `taskID` is unique for each task

### Dependencies Not Working

- Verify dependency format (should be task ID as string)
- Check that referenced tasks exist
- Ensure `dependency` field is mapped in `taskFields`

### Export Not Working

- Verify export services are provided in component
- Check that `allowExcelExport` or `allowPdfExport` is `true`
- Ensure toolbar is enabled if using toolbar export

## Related Components

- **Scheduler**: For calendar-based event management
- **Chart**: For data visualization
- **Data Grid**: For tabular data display

## API Reference

For complete API reference, see [Syncfusion Gantt Documentation](https://ej2.syncfusion.com/angular/documentation/gantt/getting-started/).

