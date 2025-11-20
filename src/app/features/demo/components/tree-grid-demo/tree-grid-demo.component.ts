import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeGridComponent, TreeGridColumn } from '../../../../shared/components/tree-grid/tree-grid.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-tree-grid-demo',
  standalone: true,
  imports: [CommonModule, TreeGridComponent, GlassCardComponent],
  templateUrl: './tree-grid-demo.component.html',
  styleUrls: ['./tree-grid-demo.component.scss']
})
export class TreeGridDemoComponent {
  @ViewChild('treegrid') treegrid!: TreeGridComponent;

  // Sample hierarchical data
  sampleData: any[] = [
    {
      taskID: 1,
      taskName: 'Planning',
      startDate: new Date('02/03/2017'),
      endDate: new Date('02/07/2017'),
      progress: 100,
      duration: 5,
      priority: 'Normal',
      approved: false,
      subtasks: [
        {
          taskID: 2,
          taskName: 'Plan timeline',
          startDate: new Date('02/03/2017'),
          endDate: new Date('02/07/2017'),
          progress: 100,
          duration: 5,
          priority: 'Normal',
          approved: false
        },
        {
          taskID: 3,
          taskName: 'Plan budget',
          startDate: new Date('02/03/2017'),
          endDate: new Date('02/07/2017'),
          progress: 100,
          duration: 5,
          priority: 'Low',
          approved: true
        },
        {
          taskID: 4,
          taskName: 'Allocate resources',
          startDate: new Date('02/03/2017'),
          endDate: new Date('02/07/2017'),
          progress: 100,
          duration: 5,
          priority: 'Critical',
          approved: false
        },
        {
          taskID: 5,
          taskName: 'Planning complete',
          startDate: new Date('02/07/2017'),
          endDate: new Date('02/07/2017'),
          progress: 0,
          duration: 0,
          priority: 'Low',
          approved: true
        }
      ]
    },
    {
      taskID: 6,
      taskName: 'Design',
      startDate: new Date('02/10/2017'),
      endDate: new Date('02/14/2017'),
      progress: 86,
      duration: 3,
      priority: 'High',
      approved: false,
      subtasks: [
        {
          taskID: 7,
          taskName: 'Software Specification',
          startDate: new Date('02/10/2017'),
          endDate: new Date('02/12/2017'),
          progress: 60,
          duration: 3,
          priority: 'Normal',
          approved: false
        },
        {
          taskID: 8,
          taskName: 'Develop prototype',
          startDate: new Date('02/10/2017'),
          endDate: new Date('02/12/2017'),
          progress: 100,
          duration: 3,
          priority: 'Critical',
          approved: false
        },
        {
          taskID: 9,
          taskName: 'Get approval from customer',
          startDate: new Date('02/13/2017'),
          endDate: new Date('02/14/2017'),
          progress: 0,
          duration: 2,
          priority: 'Low',
          approved: true
        },
        {
          taskID: 10,
          taskName: 'Design Documentation',
          startDate: new Date('02/13/2017'),
          endDate: new Date('02/14/2017'),
          progress: 0,
          duration: 2,
          priority: 'High',
          approved: true
        }
      ]
    },
    {
      taskID: 11,
      taskName: 'Implementation Phase',
      startDate: new Date('02/17/2017'),
      endDate: new Date('02/27/2017'),
      progress: 0,
      duration: 11,
      priority: 'Normal',
      approved: false,
      subtasks: [
        {
          taskID: 12,
          taskName: 'Phase 1',
          startDate: new Date('02/17/2017'),
          endDate: new Date('02/27/2017'),
          progress: 50,
          duration: 11,
          priority: 'High',
          approved: false,
          subtasks: [
            {
              taskID: 13,
              taskName: 'Implementation Module 1',
              startDate: new Date('02/17/2017'),
              endDate: new Date('02/27/2017'),
              progress: 50,
              duration: 11,
              priority: 'Normal',
              approved: false
            }
          ]
        },
        {
          taskID: 14,
          taskName: 'Phase 2',
          startDate: new Date('02/17/2017'),
          endDate: new Date('02/28/2017'),
          progress: 60,
          duration: 12,
          priority: 'Critical',
          approved: false
        }
      ]
    }
  ];

  columns: TreeGridColumn[] = [
    { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right', isPrimaryKey: true },
    { field: 'taskName', headerText: 'Task Name', width: 200, textAlign: 'Left' },
    { field: 'startDate', headerText: 'Start Date', width: 120, format: 'yMd', textAlign: 'Right', type: 'date' },
    { field: 'endDate', headerText: 'End Date', width: 120, format: 'yMd', textAlign: 'Right', type: 'date' },
    { field: 'duration', headerText: 'Duration', width: 90, textAlign: 'Right' },
    { field: 'progress', headerText: 'Progress', width: 90, textAlign: 'Right' },
    { field: 'priority', headerText: 'Priority', width: 100, textAlign: 'Left' },
    { field: 'approved', headerText: 'Approved', width: 100, textAlign: 'Center', type: 'boolean' }
  ];

  // Event handlers
  onCreated(event: any): void {
    console.log('Tree Grid created:', event);
  }

  onDataBound(event: any): void {
    console.log('Data bound:', event);
  }

  onRowSelected(event: any): void {
    console.log('Row selected:', event);
  }

  onRecordClick(event: any): void {
    console.log('Record clicked:', event);
  }

  // Actions
  expandAll(): void {
    if (this.treegrid) {
      this.treegrid.expandAll();
    }
  }

  collapseAll(): void {
    if (this.treegrid) {
      this.treegrid.collapseAll();
    }
  }

  getSelectedRows(): void {
    if (this.treegrid) {
      const selected = this.treegrid.getSelectedRows();
      console.log('Selected rows:', selected);
      alert(`Selected ${selected.length} row(s)`);
    }
  }

  exportToExcel(): void {
    if (this.treegrid) {
      this.treegrid.exportToExcel('treegrid');
    }
  }

  exportToPdf(): void {
    if (this.treegrid) {
      this.treegrid.exportToPdf('treegrid');
    }
  }

  exportToCsv(): void {
    if (this.treegrid) {
      this.treegrid.exportToCsv('treegrid');
    }
  }

  search(searchText: string): void {
    if (this.treegrid && searchText) {
      this.treegrid.search(searchText);
    }
  }

  clearSearch(): void {
    if (this.treegrid) {
      this.treegrid.clearSearch();
    }
  }
}

