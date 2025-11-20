import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

export interface Child {
    link: string
    code: string
    tName: string
    eName: string
}
export interface List {
    val: number
    name: string
    link: string
    child: Child[],
    img: string
}

const LIST_DATA: List[] = [
    { val: 1, name: 'Trouble Box', link: '01', child: [], img: "assets/images/iconworkflow/กล่องงานมีปัญหา_.png" },
    {
        val: 2, name: 'Workflow Definition', link: '02', img: "assets/images/iconworkflow/กำหนดทางเดินเอกสาร_.png", child: [
            {
                "link": "../wf-commandline",
                "code": "",
                "tName": "กำหนดสายบังคับบัญชา",
                "eName": "Command line Setting"
            },
            //       // {
            //       //   "link": "../wf-commandline-daisin",
            //       //   "code": "",
            //       //   "tName": "กำหนดสายบังคับบัญชา (Daisin)",
            //       //   "eName": "Command line Setting (Daisin)"
            //       // },
            {
                "link": "../wf-import-export-data",
                "code": "",
                "tName": "นำข้อมูลเข้าระบบและนำข้อมูลออกจากระบบ",
                "eName": "Import Data and Export Data"
            },
            {
                "link": "../wf-repare-routing",
                "code": "",
                "tName": "แก้ไขสเต็ปการอนุมัติที่มีปัญหา",
                "eName": "Repare Step Routing"
            }
            //       // {
            //       //   "link": "../wf-import-data01",
            //       //   "code": "",
            //       //   "tName": "นำข้อมูลเข้าระบบ",
            //       //   "eName": "Import Data"
            //       // },
            //       // {
            //       //   "link": "../wf-import-data01-daisin",
            //       //   "code": "",
            //       //   "tName": "นำข้อมูลเข้าระบบ (Daisin)",
            //       //   "eName": "Import Data (Daisin)"
            //       // },
            //       // {
            //       //   "link": "../wf-export-data",
            //       //   "code": "",
            //       //   "tName": "นำข้อมูลออกจากระบบ",
            //       //   "eName": "Export Data"
            //       // }
        ]
    },
    {
        val: 3, name: 'View Document', link: '03', img: "assets/images/iconworkflow/รายการเอกสาร_.png", child: [
            {
                "link": "../admin-view",
                "code": "",
                "tName": "รายการเอกสาร (ปัจจุบัน)",
                "eName": "View Document (Current)"
            },
            {
                "link": "../viewadmin-clean",
                "code": "",
                "tName": "รายการเอกสาร (ประวัติ)",
                "eName": "View Document (History)"
            }
        ]
    },
    // { val: 4, name: 'Edit Document', link: '04', child: [] },
    // { val: 5, name: 'Cancel Document', link: '05', child: [] },
    { val: 6, name: 'Archive Document', link: '06', img: "assets/images/iconworkflow/ลบเอกสาร_.png", child: [] },
    // { val: 7, name: 'Delete Document (History)', link: '07', child: [] },
    { val: 8, name: 'Transfer Data', link: '08', img: "assets/images/iconworkflow/โอนข้อมูล_.png", child: [] },
    {
        val: 9, name: 'Admin Transfer WF', link: '09', img: "assets/images/iconworkflow/มอบหมายเอกสาร_.png", child: [
            {
                "link": "../auto-assign-pos",
                "code": "",
                "tName": "มอบหมายงานอัตโนมัติ(ตำแหน่ง)",
                "eName": "Auto Assign by Position"
            },
            // {
            //   "link": "../auto-assign-work",
            //   "code": "",
            //   "tName": "มอบหมายงานอัตโนมัติ(เวิร์คโฟล์)",
            //   "eName": "Auto Assign by Workflow"
            // },
            {
                "link": "../adm-assign-wf",
                "code": "",
                "tName": "มอบหมายงานโดยเอกสาร",
                "eName": "Force Assign"
            }
        ]
    },
    {
        val: 10, name: 'Setting', link: '10', img: "assets/images/iconworkflow/การตั้งค่า_.png", child: [
            {
                "link": "../wf-remark",
                "code": "",
                "tName": "หมายเหตุ-เอกสาร",
                "eName": "Remark Document"
            }
        ]
    },
]

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule, RouterModule],
    selector: 'app-workflow-admin-menu',
    templateUrl: './workflow-admin-menu.component.html',
    styleUrls: ['./workflow-admin-menu.component.scss']
})
export class WorkflowAdminMenuComponent implements OnInit {
    active = 0
    listMenu = LIST_DATA
    constructor(private router: Router,
        private translateService: TranslateService) {
    }

    routerLink(link: string) {
        if (link == '01') {
            this.router.navigate(['/admin/trouble-box'])
        }
        if (link == '04') {
            this.router.navigate(['/admin/admin-edit'])
        }
        if (link == '05') {
            this.router.navigate(['/admin/admin-cancel'])
        }
        if (link == '06') {
            this.router.navigate(['/admin/admin-clean'])
        }
        if (link == '07') {
            this.router.navigate(['/admin/admin-delete'])
        }
        if (link == '08') {
            this.router.navigate(['/admin/admin-transfer'])
        }
    }

    getDesc(tdesc: string, edesc: string): string {
        return this.translateService.currentLang == 'th' ? tdesc : edesc
    }

    ngOnInit(): void {
    }

    windowWidthBelow(width: number): boolean {
        return window.innerWidth < width
    }

}
