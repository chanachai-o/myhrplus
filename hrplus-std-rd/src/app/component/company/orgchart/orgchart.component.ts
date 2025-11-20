import OrgChart from "src/assets/balkanapp/orgchart";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { forkJoin, from, Observable } from "rxjs";
import { map, tap, switchMap, filter, reduce } from "rxjs/operators";
import { MyWorkingsModel, WorkingsModel } from "src/app/models/workingmodel.model";
import { EmployeeService } from "src/app/services/employee.service";
import { TranslateService, TranslateModule } from "@ngx-translate/core";

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    selector: "app-orgchart",
    templateUrl: "./orgchart.component.html",
    styleUrls: ["./orgchart.component.scss"],
})
export class OrgchartComponent implements OnInit {
    chart: any;
    chartList: any = [];
    loading = false;

    constructor(
        private empService: EmployeeService,
        private routes: Router,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.getEmp();

        this.translateService.onLangChange.subscribe((event) => {
            if (event.lang === 'th') {
                this.getEmp();
            } else if (event.lang === 'en') {
                this.getEmp();
            }
        });
    }

    initChart() {
        // Define a new, modern template based on the design system
        OrgChart.templates.gemini = Object.assign({}, OrgChart.templates.ana);
        OrgChart.templates.gemini.size = [280, 120];
        OrgChart.templates.gemini.node =
            '<rect x="0" y="0" height="{h}" width="{w}" fill="var(--card-background)" stroke-width="1" stroke="var(--border-color)" rx="12" ry="12"></rect>';
        OrgChart.templates.gemini.img_0 =
            '<clipPath id="{randId}"><circle cx="60" cy="60" r="50"></circle></clipPath>' +
            '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="10" width="100" height="100"></image>';
        OrgChart.templates.gemini.field_0 =
            '<text data-width="180" class="field-name" style="font-size: 18px;" fill="var(--text-primary)" x="110" y="35" text-anchor="start">{val}</text>';
        OrgChart.templates.gemini.field_1 =
            '<text data-width="180" data-text-overflow="multiline" class="field-position" style="font-size: 14px;" fill="var(--text-secondary)" x="110" y="60" text-anchor="start">{val}</text>';

        // Define a smaller template for collapsed nodes
        OrgChart.templates.gemini_small = Object.assign({}, OrgChart.templates.gemini);
        OrgChart.templates.gemini_small.size = [220, 80];
        OrgChart.templates.gemini_small.img_0 =
            '<clipPath id="{randId}"><circle cx="40" cy="40" r="35"></circle></clipPath>' +
            '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="5" y="5" width="70" height="70"></image>';
        OrgChart.templates.gemini_small.field_0 =
            '<text data-width="120" class="field-name" style="font-size: 16px;" fill="var(--text-primary)" x="85" y="35" text-anchor="start">{val}</text>';
        OrgChart.templates.gemini_small.field_1 =
            '<text data-width="120" class="field-position" style="font-size: 12px;" fill="var(--text-secondary)" x="85" y="55" text-anchor="start">{val}</text>';

        var mapIcon = `<svg width="24" height="24" viewBox="0 0 490 490" >
        <polygon fill="#fff" points="320.217,101.428 171.009,5.241 171.009,392.966 320.217,485.979 	"/>
        <polygon fill="#fff" points="335.529,99.857 335.529,484.679 490,391.948 490,0 	"/>
        <polygon fill="#fff" points="155.697,3.659 0,82.979 0,490 155.697,392.942 	"/>
    </svg>`;
        this.chart = new OrgChart(document.getElementById('tree')!, {
            // General settings
            template: "gemini",
            mouseScrool: OrgChart.action.zoom,
            orderBy: 'id',
            enableSearch: true,
            enableDragDrop: false, // Keep it simple
            nodeMouseClick: OrgChart.action.details,
            showXScroll: OrgChart.scroll.visible,
            showYScroll: OrgChart.scroll.visible,

            // Layout and spacing
            align: OrgChart.ORIENTATION,
            siblingSeparation: 40,
            subtreeSeparation: 40,
            mixedHierarchyNodesSeparation: 20,

            // Animations
            // animation: {
            //     func: OrgChart.anim.outBack,
            //     duration: 500
            // },

            // Collapse & Expand
            collapse: {
                level: 3, // Show more levels initially
                allChildren: true,
            },

            // Toolbar
            toolbar: {
                fullScreen: true,
                zoom: true,
                fit: true,
                expandAll: this.chartList.length < 1000,
            },

            // Minimap for easy navigation
            miniMap: true,

            // Node bindings
            nodeBinding: {
                field_0: "name",
                field_1: "position",
                field_2: "bu1",
                field_3: "bu2",
                field_4: "bu3",
                field_5: "bu4",
                field_6: "bu5",
                img_0: "img",
                see_more_field: 'see_more_field'
            },
            filterBy: ['position', 'bu1', 'bu2', 'bu3', 'bu4', 'bu5'],

            // Export options
            menu: {
                pdf: { text: "Export PDF" },
                png: { text: "Export PNG" },
                svg: { text: "Export SVG" },
                csv: { text: "Export CSV" },
            },

            // Context menu for each node
            nodeMenu: {
                details: {
                    text: this.translateService.instant("ดูข้อมูลพนักงาน"),
                    icon: OrgChart.icon.details(18, 18, 'var(--primary-color)'),
                    onClick: (nodeId: any) => {
                        this.routes.navigate([
                            "/employee/employee-work-information/" + btoa(nodeId),
                        ]);
                    }
                }
            },

            // Disable the default pop-up form
            editForm: {
                addMore: 'Add more elements',
                readOnly: true,
                generateElementsFromFields: false,
                buttons: {
                    details: {
                        icon: mapIcon,
                        text: 'More Detail'
                    },
                    edit: null,
                    share: null,
                    pdf: null,
                    remove: null
                },
                elements: [
                    [{ type: 'textbox', label: this.translateService.instant("Employee ID"), binding: 'id' },
                    { type: 'textbox', label: this.translateService.instant("Position"), binding: 'position' }],
                    [{ type: 'textbox', label: this.translateService.instant("bu1"), binding: 'bu1' },
                    { type: 'textbox', label: this.translateService.instant("bu2"), binding: 'bu2' }],
                    [
                        { type: 'textbox', label: this.translateService.instant("bu3"), binding: 'bu3' },
                        { type: 'textbox', label: this.translateService.instant("bu4"), binding: 'bu4' }]
                ]
            },
        });

        this.chart.editUI.on('button-click', (sender: any, args: any) => {
            if (args.name == 'details') {
                var data = this.chart.get(args.nodeId);
                this.routes.navigate([
                    "/employee/employee-work-information/" + btoa(args.nodeId),
                ]);
            }
        });
        this.chart.on('searchclick', (sender: any, nodeId: any) => {
            sender.center(nodeId, {
                parentState: OrgChart.COLLAPSE_PARENT_NEIGHBORS,
                childrenState: OrgChart.COLLAPSE_SUB_CHILDRENS,
                animate: true
            });
            return false; // Prevent default behavior
        });

        this.chart.on('redraw', (sender: any) => {
            // Apply different templates based on collapse state
            for (var id in sender.nodes) {
                var node = sender.nodes[id];
                if (node.collapsed) {
                    node.templateName = 'gemini_small';
                } else {
                    node.templateName = 'gemini';
                }
            }
        });
        this.chart.load(this.chartList);
    }

    getEmp() {
        this.loadDatasource()
            .pipe(
                // tap((arr) => console.log("multi response", arr)), // Optional: for debugging
                switchMap((arr) => from(arr)),
                filter((m) => m.bossId != null && m.bossId !== ""),
                map((m) => {
                    const boss =
                        m.bossId != null && m.bossId !== m.employeeId
                            ? m.bossId
                            : null; // Use null for root nodes
                    return {
                        id: m.employeeId,
                        pid: boss,
                        name: m.getFullname(),
                        position: m.position?.getPositionDesc!() || 'N/A',
                        img: m.getPictureUrl(),
                        bu1: this.translateService.currentLang == 'th' ? (m.bu1?.tdesc) || '' : (m.bu1?.edesc || ''),
                        bu2: this.translateService.currentLang == 'th' ? (m.bu2?.tdesc) || '' : (m.bu2?.edesc || ''),
                        bu3: this.translateService.currentLang == 'th' ? (m.bu3?.tdesc) || '' : (m.bu3?.edesc || ''),
                        bu4: this.translateService.currentLang == 'th' ? (m.bu4?.tdesc) || '' : (m.bu4?.edesc || ''),
                        bu5: this.translateService.currentLang == 'th' ? (m.bu5?.tdesc) || '' : (m.bu5?.edesc || ''),
                    };
                }),
                reduce((acc: any[], curr) => acc.concat(curr), [])
            )
            .subscribe({
                next: (response: any) => {
                    this.chartList = response;
                    this.loading = false;
                    // We need to wait for the next tick to ensure the #tree element is in the DOM
                    setTimeout(() => this.initChart(), 0);
                },
                error: (err) => {
                    console.error("Error loading employee data:", err);
                    this.loading = false;
                }
            });
    }

    loadDatasource(): Observable<WorkingsModel[]> {
        // Fetch the first page to determine total pages
        return this.empService.getListEmpWorkingObserve(500, 0).pipe(
            switchMap((res: any) => {
                if (!res || res.totalPages === 0) {
                    return from([[]]); // Return empty if no data
                }
                // Create an array of Observables for all pages
                const req$ = Array.from({ length: res.totalPages }, (_, i) =>
                    this.empService.getListEmpWorkingObserve(res.size, i)
                );
                // Execute all requests in parallel
                return forkJoin(req$).pipe(
                    map((responses: any[]) => {
                        // Flatten the array of pages into a single data array
                        const data = responses.reduce((acc, x) => acc.concat(x.content), []);
                        return data.map((e: any) => new MyWorkingsModel(e, this.translateService));
                    })
                );
            })
        );
    }

    refreshChart(): void {
        // Reload organization chart data
        this.loading = true;
        this.getEmp();
    }

    exportChart(): void {
        // Export organization chart as image or PDF
        if (this.chart) {
            // This would typically export the chart as an image
            console.log('Exporting organization chart...');
            // Add export logic here (e.g., using html2canvas or similar library)
        }
    }
}
