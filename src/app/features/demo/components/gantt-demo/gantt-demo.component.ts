import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent, GanttTask, GanttColumn } from '../../../../shared/components/gantt/gantt.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-gantt-demo',
  standalone: true,
  imports: [CommonModule, GanttComponent, GlassCardComponent],
  templateUrl: './gantt-demo.component.html',
  styleUrls: ['./gantt-demo.component.scss']
})
export class GanttDemoComponent {
  @ViewChild('gantt') gantt!: GanttComponent;

  // Sample Gantt data
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
        },
        {
          taskID: 4,
          taskName: 'Budget Planning',
          startDate: new Date('2024-01-11'),
          endDate: new Date('2024-01-15'),
          duration: 5,
          progress: 80
        }
      ]
    },
    {
      taskID: 5,
      taskName: 'Design Phase',
      startDate: new Date('2024-01-16'),
      endDate: new Date('2024-02-15'),
      duration: 30,
      progress: 60,
      subtasks: [
        {
          taskID: 6,
          taskName: 'UI/UX Design',
          startDate: new Date('2024-01-16'),
          endDate: new Date('2024-02-05'),
          duration: 20,
          progress: 70
        },
        {
          taskID: 7,
          taskName: 'Database Design',
          startDate: new Date('2024-01-26'),
          endDate: new Date('2024-02-15'),
          duration: 20,
          progress: 50
        }
      ]
    },
    {
      taskID: 8,
      taskName: 'Development Phase',
      startDate: new Date('2024-02-16'),
      endDate: new Date('2024-04-15'),
      duration: 60,
      progress: 30,
      subtasks: [
        {
          taskID: 9,
          taskName: 'Frontend Development',
          startDate: new Date('2024-02-16'),
          endDate: new Date('2024-03-20'),
          duration: 33,
          progress: 40
        },
        {
          taskID: 10,
          taskName: 'Backend Development',
          startDate: new Date('2024-02-26'),
          endDate: new Date('2024-04-05'),
          duration: 39,
          progress: 25
        },
        {
          taskID: 11,
          taskName: 'Integration',
          startDate: new Date('2024-04-06'),
          endDate: new Date('2024-04-15'),
          duration: 10,
          progress: 10
        }
      ]
    },
    {
      taskID: 12,
      taskName: 'Testing Phase',
      startDate: new Date('2024-04-16'),
      endDate: new Date('2024-05-15'),
      duration: 30,
      progress: 0,
      subtasks: [
        {
          taskID: 13,
          taskName: 'Unit Testing',
          startDate: new Date('2024-04-16'),
          endDate: new Date('2024-05-01'),
          duration: 15,
          progress: 0
        },
        {
          taskID: 14,
          taskName: 'Integration Testing',
          startDate: new Date('2024-05-02'),
          endDate: new Date('2024-05-15'),
          duration: 14,
          progress: 0
        }
      ]
    },
    {
      taskID: 15,
      taskName: 'Deployment',
      startDate: new Date('2024-05-16'),
      endDate: new Date('2024-05-20'),
      duration: 5,
      progress: 0
    }
  ];

  // Columns configuration
  columns: GanttColumn[] = [
    { field: 'taskID', headerText: 'ID', width: 80, textAlign: 'Right' },
    { field: 'taskName', headerText: 'Task Name', width: 250 },
    { field: 'startDate', headerText: 'Start Date', width: 120, format: 'yMd' },
    { field: 'endDate', headerText: 'End Date', width: 120, format: 'yMd' },
    { field: 'duration', headerText: 'Duration', width: 100, textAlign: 'Right' },
    { field: 'progress', headerText: 'Progress', width: 100, textAlign: 'Right' }
  ];

  // Task fields configuration
  taskFields: any = {
    id: 'taskID',
    name: 'taskName',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    dependency: 'dependency',
    child: 'subtasks'
  };

  // Settings
  allowSelection: boolean = true;
  allowSorting: boolean = true;
  allowFiltering: boolean = true;
  allowResizing: boolean = true;
  allowReordering: boolean = true;
  allowEditing: boolean = true;
  enableToolbar: boolean = true;
  allowExcelExport: boolean = true;
  allowPdfExport: boolean = true;
  enableCriticalPath: boolean = false;

  // Methods
  refresh(): void {
    this.gantt?.refresh();
  }

  exportToExcel(): void {
    this.gantt?.exportToExcel('GanttChart');
  }

  exportToPdf(): void {
    this.gantt?.exportToPdf('GanttChart');
  }

  exportToCsv(): void {
    this.gantt?.exportToCsv('GanttChart');
  }

  expandAll(): void {
    this.gantt?.expandAll();
  }

  collapseAll(): void {
    this.gantt?.collapseAll();
  }

  clearSelection(): void {
    this.gantt?.clearSelection();
  }

  getSelectedRows(): void {
    const selected = this.gantt?.getSelectedRows();
    if (selected && selected.length > 0) {
      console.log('Selected rows:', selected);
      alert(`Selected ${selected.length} row(s)`);
    } else {
      alert('No rows selected');
    }
  }

  onActionBegin(event: any): void {
    console.log('Action begin:', event);
  }

  onActionComplete(event: any): void {
    console.log('Action complete:', event);
  }

  onRowSelected(event: any): void {
    console.log('Row selected:', event);
  }

  onDataBound(event: any): void {
    console.log('Data bound:', event);
  }
}

