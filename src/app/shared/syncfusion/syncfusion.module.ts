import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Syncfusion Buttons & Inputs
import { ButtonModule, ChipListModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { TextBoxModule, TextAreaModule, NumericTextBoxModule, MaskedTextBoxModule, SliderModule, UploaderModule, ColorPickerModule, SignatureModule, RatingModule, OtpInputModule, SpeechToTextModule, SmartTextAreaModule } from '@syncfusion/ej2-angular-inputs';

// Syncfusion Dropdowns
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';

// Syncfusion Navigation
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { BreadcrumbModule } from '@syncfusion/ej2-angular-navigations';
import { MenuModule } from '@syncfusion/ej2-angular-navigations';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { CarouselModule } from '@syncfusion/ej2-angular-navigations';

// Syncfusion Layouts
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';

// Syncfusion Data Grids
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { PivotViewModule } from '@syncfusion/ej2-angular-pivotview';

// Syncfusion Charts
import { ChartModule, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';

// Syncfusion Calendars
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';

// Syncfusion Schedule
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

// Syncfusion Editors
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { DocumentEditorModule } from '@syncfusion/ej2-angular-documenteditor';
import { PdfViewerModule } from '@syncfusion/ej2-angular-pdfviewer';
import { SpreadsheetModule } from '@syncfusion/ej2-angular-spreadsheet';
import { ImageEditorModule } from '@syncfusion/ej2-angular-image-editor';

// Syncfusion Project Management
import { GanttModule } from '@syncfusion/ej2-angular-gantt';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';

// Syncfusion Advanced
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';
import { QueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { MessageModule } from '@syncfusion/ej2-angular-notifications';
import { ChatUIModule, AIAssistViewModule } from '@syncfusion/ej2-angular-interactive-chat';

// Syncfusion Lists
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

// Syncfusion File Manager
import { FileManagerModule } from '@syncfusion/ej2-angular-filemanager';

/**
 * Syncfusion Module
 *
 * This module imports all Syncfusion Angular modules needed for the UI Kit.
 * Import this module in your feature modules to use Syncfusion components.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Buttons & Inputs
    ButtonModule,
    SplitButtonModule,
    ChipListModule,
    CheckBoxModule,
    TextBoxModule,
    TextAreaModule,
    SpeechToTextModule,
    SmartTextAreaModule,
    NumericTextBoxModule,
    MaskedTextBoxModule,
    SliderModule,
    UploaderModule,
    ColorPickerModule,
    SignatureModule,
    RatingModule,
    OtpInputModule,

    // Dropdowns
    DropDownListModule,
    AutoCompleteModule,
    MultiSelectModule,
    ComboBoxModule,

    // Navigation
    AccordionModule,
    ToolbarModule,
    ContextMenuModule,
    TabModule,
    BreadcrumbModule,
    MenuModule,
    SidebarModule,
    CarouselModule,

    // Layouts
    DashboardLayoutModule,
    SplitterModule,

    // Data Grids
    GridModule,
    TreeGridModule,
    PivotViewModule,

    // Charts
    ChartModule,
    AccumulationChartModule,

    // Calendars
    CalendarModule,
    DatePickerModule,
    DateRangePickerModule,
    TimePickerModule,
    DateTimePickerModule,

    // Schedule
    ScheduleModule,

    // Editors
    RichTextEditorModule,
    DocumentEditorModule,
    PdfViewerModule,
    SpreadsheetModule,
    ImageEditorModule,

    // Project Management
    GanttModule,
    KanbanModule,

    // Advanced
    DiagramModule,
    QueryBuilderModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    MessageModule,
    ChatUIModule,
    AIAssistViewModule,

    // Lists
    ListViewModule,

    // File Manager
    FileManagerModule
  ],
  exports: [
    // Buttons & Inputs
    ButtonModule,
    SplitButtonModule,
    ChipListModule,
    CheckBoxModule,
    TextBoxModule,
    TextAreaModule,
    SpeechToTextModule,
    SmartTextAreaModule,
    NumericTextBoxModule,
    MaskedTextBoxModule,
    SliderModule,
    UploaderModule,
    ColorPickerModule,
    SignatureModule,
    RatingModule,
    OtpInputModule,

    // Dropdowns
    DropDownListModule,
    AutoCompleteModule,
    MultiSelectModule,
    ComboBoxModule,

    // Navigation
    AccordionModule,
    ToolbarModule,
    ContextMenuModule,
    TabModule,
    BreadcrumbModule,
    MenuModule,
    SidebarModule,
    CarouselModule,

    // Layouts
    DashboardLayoutModule,
    SplitterModule,

    // Data Grids
    GridModule,
    TreeGridModule,
    PivotViewModule,

    // Charts
    ChartModule,
    AccumulationChartModule,

    // Calendars
    CalendarModule,
    DatePickerModule,
    DateRangePickerModule,
    TimePickerModule,
    DateTimePickerModule,

    // Schedule
    ScheduleModule,

    // Editors
    RichTextEditorModule,
    DocumentEditorModule,
    PdfViewerModule,
    SpreadsheetModule,
    ImageEditorModule,

    // Project Management
    GanttModule,
    KanbanModule,

    // Advanced
    DiagramModule,
    QueryBuilderModule,
    DialogModule,
    TooltipModule,
    ToastModule,
    MessageModule,
    ChatUIModule,
    AIAssistViewModule,

    // Lists
    ListViewModule,

    // File Manager
    FileManagerModule
  ]
})
export class SyncfusionModule { }

