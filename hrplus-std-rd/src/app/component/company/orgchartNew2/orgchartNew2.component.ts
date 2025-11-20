import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    Injectable,
    AfterViewInit,
    ViewChild,
} from "@angular/core";
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrgchartnewService } from "src/app/services/orgchartnew.service";
import OrgChart from "src/assets/balkanapp/orgchart";
import { Router } from "@angular/router";
import { forkJoin, from, Observable } from "rxjs";
import { filter, map, reduce, switchMap, tap } from "rxjs/operators";
import { AlertModalComponent } from "src/app/component/workflow/workflow-type/alert-modal/alert-modal.component";
import { ConfirmModalComponent } from "src/app/component/workflow/workflow-type/confirm-modal/confirm-modal.component";

interface OrgData {
    id: string;
    tdesc: string;
    edesc: string;
    parent?: string | undefined;
    tags?: any;
    stpId: string;
    level: any;
    img: string;
}

interface OrgData1 {
    companyId: string;
    nameTh: string;
    nameEng: string;
    position: string;
    level: number;
    stpId: string;
    img: string;
    tags: string[];
    orderNo: number;
    id: string;
    parent: string;
}

interface OrgData2 {
    id: string;
    bossId: string;
    name: string;
    img: string;
    position: string;
}

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
    selector: "app-orgchartNew2",
    templateUrl: "./orgchartNew2.component.html",
    styleUrls: ["./orgchartNew2.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class OrgchartNew2Component implements OnInit {
    @ViewChild("addNodeModal") addNodeModal: any; // อ้างอิงถึง modal
    @ViewChild("modalDetail", { static: true }) modalDetail: any;
    @ViewChild("modalEdit", { static: true }) modalEdit: any;
    @ViewChild("detailEmpModal", { static: true }) detailEmpModal: any;
    @ViewChild("addEmpModal", { static: true }) addEmpModal: any;
    @ViewChild("editEmpModal", { static: true }) editEmpModal: any;


    selectedNode: OrgData1[] = []; // ใช้เก็บข้อมูลโหนดที่เลือก
    activeKeep = 1;

    orgData: OrgData[] = [];
    orgData1: OrgData1[] = [];
    chartList: any = [];
    chart: any;
    chart2: any;
    loading = false;

    newNode: {
        id: string;
        pid: string;
        tdesc: string;
        edesc: string;
        // title: string;
        position: string;
        tags: string[];
        level: number;
        numEmp: number;
        // stpid: string
        emp?: {
            employeeId: string,
            bossId: string,
            fname: string,
            lname: string,
            efname: string,
            elname: string,
            bu1: { bu1id: string, tdesc: string, edesc: string, img: string, parent: string },
            bu2: { bu2id: string, tdesc: string, edesc: string, img: string, parent: string },
            bu3: { bu3id: string, tdesc: string, edesc: string, img: string, parent: string },
            bu4: { bu4id: string, tdesc: string, edesc: string, img: string, parent: string },
            bu5: { bu5id: string, tdesc: string, edesc: string, img: string, parent: string },
            position: string,
            picture: string,
            plId: number
        }
    } = {
            id: "",
            pid: "",
            tdesc: "",
            edesc: "",
            // title: "",
            position: "",
            tags: [],
            level: 1,
            numEmp: 0
            // stpid: "",
        };

    newEmp: {
        id: string
        name: string
        nameEng: string
        position: string
        img: string
        bu1: string
        bu2: string
        bu3: string
        bu4: string
        bu5: string
        plId: number
        stpid: string
        tags: ['']
        level: 6,
        fname?: string
        lname?: string
        efname?: string
        elname?: string
        parent?: { bu5id: string, tdesc: string, edesc: string, img: string, parent: string }

    } =
        {
            id: "",
            name: "",
            nameEng: "",
            position: "",
            img: "",
            bu1: "",
            bu2: "",
            bu3: "",
            bu4: "",
            bu5: "",
            plId: 1,
            stpid: "",
            tags: [''],
            level: 6,
            parent: { bu5id: "", tdesc: "", edesc: "", img: "", parent: "" }
        }
    bu1List: { bu1id: string, tdesc: string, edesc: string, img: string, parent: string }[] = []
    bu2List: { bu2id: string, tdesc: string, edesc: string, img: string, parent: string }[] = []
    bu3List: { bu3id: string, tdesc: string, edesc: string, img: string, parent: string }[] = []
    bu4List: { bu4id: string, tdesc: string, edesc: string, img: string, parent: string }[] = []
    bu5List: { bu5id: string, tdesc: string, edesc: string, img: string, parent: string }[] = []
    constructor(private org: OrgchartnewService, private ngbModal: NgbModal,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        // this.getListBuAll()
        this.getEmpData()
    }

    // จำนวนคน
    chartListCheckEmp(id: any) {
        // สร้างชุดข้อมูลของแผนกทั้งหมดที่เชื่อมโยงกับแผนกที่เลือก
        const getSubDepartments = (parentId: any) => {
            let subDepartments = this.chartList.filter((dep: any) => dep.pid === parentId).map((dep: any) => dep.id);
            let result = [...subDepartments];
            subDepartments.forEach((depId: any) => {
                result = result.concat(getSubDepartments(depId));
            });
            return result;
        };
        // หาแผนกที่เชื่อมโยงกับแผนกที่เลือก
        const subDepartments = getSubDepartments(id);
        subDepartments.push(id); // รวมแผนกที่เลือกด้วย
        // ค้นหาพนักงานที่ตรงกับ `stpid` และ `tags` เป็น "empList"
        const employees = this.chartList.filter((emp: any) => subDepartments.includes(emp.stpid) && emp.tags.includes("empList"));

        return employees.length;
    }

    initChart() {
        var detailsIcon = `<svg width="24" height="24" fill="orange" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                <path d="M447.933,103.629c-0.034-3.076-1.224-6.09-3.485-8.352L352.683,3.511c-0.004-0.004-0.007-0.005-0.011-0.008
                    C350.505,1.338,347.511,0,344.206,0H89.278C75.361,0,64.04,11.32,64.04,25.237v461.525c0,13.916,11.32,25.237,25.237,25.237
                    h333.444c13.916,0,25.237-11.32,25.237-25.237V103.753C447.96,103.709,447.937,103.672,447.933,103.629z M356.194,40.931
                    l50.834,50.834h-49.572c-0.695,0-1.262-0.567-1.262-1.262V40.931z M423.983,486.763c0,0.695-0.566,1.261-1.261,1.261H89.278
                    c-0.695,0-1.261-0.566-1.261-1.261V25.237c0-0.695,0.566-1.261,1.261-1.261h242.94v66.527c0,13.916,11.322,25.239,25.239,25.239
                    h66.527V486.763z"/>
                <path d="M362.088,164.014H149.912c-6.62,0-11.988,5.367-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175
                    c6.62,0,11.988-5.368,11.988-11.988C374.076,169.381,368.707,164.014,362.088,164.014z"/>
                <path d="M362.088,236.353H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175
                    c6.62,0,11.988-5.368,11.988-11.988C374.076,241.721,368.707,236.353,362.088,236.353z"/>
                <path d="M362.088,308.691H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988h212.175
                    c6.62,0,11.988-5.367,11.988-11.988C374.076,314.06,368.707,308.691,362.088,308.691z"/>
                <path d="M256,381.031H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988H256
                    c6.62,0,11.988-5.367,11.988-11.988C267.988,386.398,262.62,381.031,256,381.031z"/>
        </svg>`;
        var editIcon = `<svg width="24" height="24" fill="#000097" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 469.336 469.336" style="enable-background:new 0 0 469.336 469.336;" xml:space="preserve">
                <path d="M456.836,76.168l-64-64.054c-16.125-16.139-44.177-16.17-60.365,0.031L45.763,301.682
                    c-1.271,1.282-2.188,2.857-2.688,4.587L0.409,455.73c-1.063,3.722-0.021,7.736,2.719,10.478c2.031,2.033,4.75,3.128,7.542,3.128
                    c0.979,0,1.969-0.136,2.927-0.407l149.333-42.703c1.729-0.5,3.302-1.418,4.583-2.69l289.323-286.983
                    c8.063-8.069,12.5-18.787,12.5-30.192S464.899,84.237,456.836,76.168z M285.989,89.737l39.264,39.264L120.257,333.998
                    l-14.712-29.434c-1.813-3.615-5.5-5.896-9.542-5.896H78.921L285.989,89.737z M26.201,443.137L40.095,394.5l34.742,34.742
                    L26.201,443.137z M149.336,407.96l-51.035,14.579l-51.503-51.503l14.579-51.035h28.031l18.385,36.771
                    c1.031,2.063,2.708,3.74,4.771,4.771l36.771,18.385V407.96z M170.67,390.417v-17.082c0-4.042-2.281-7.729-5.896-9.542
                    l-29.434-14.712l204.996-204.996l39.264,39.264L170.67,390.417z M441.784,121.72l-47.033,46.613l-93.747-93.747l46.582-47.001
                    c8.063-8.063,22.104-8.063,30.167,0l64,64c4.031,4.031,6.25,9.385,6.25,15.083S445.784,117.72,441.784,121.72z"/>
        </svg>`;
        var addIcon = `<svg width="24" height="24" fill="green" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <path d="M225,0C150.561,0,90,60.561,90,135s60.561,135,135,135s135-60.561,135-135S299.439,0,225,0z M225,240
                c-57.897,0-105-47.103-105-105c0-57.897,47.103-105,105-105c57.897,0,105,47.103,105,105C330,192.897,282.897,240,225,240z"/>
            <path d="M407,302c-23.388,0-45.011,7.689-62.483,20.667C315.766,308.001,284.344,300,255,300h-60
                c-52.009,0-101.006,20.667-137.966,58.195C20.255,395.539,0,444.834,0,497c0,8.284,6.716,15,15,15h392
                c57.897,0,105-47.103,105-105C512,349.103,464.897,302,407,302z M30.66,482c7.515-85.086,78.351-152,164.34-152h60
                c21.784,0,45.088,5.346,67.152,15.224C309.487,362.57,302,383.926,302,407c0,29.354,12.113,55.927,31.596,75H30.66z M407,482
                c-41.355,0-75-33.645-75-75c0-21.876,9.418-41.591,24.409-55.313c0.052-0.048,0.103-0.098,0.154-0.147
                C369.893,339.407,387.597,332,407,332c41.355,0,75,33.645,75,75C482,448.355,448.355,482,407,482z"/>
            <path d="M437,392h-15v-15c0-8.284-6.716-15-15-15s-15,6.716-15,15v15h-15c-8.284,0-15,6.716-15,15s6.716,15,15,15h15v15
                c0,8.284,6.716,15,15,15s15-6.716,15-15v-15h15c8.284,0,15-6.716,15-15S445.284,392,437,392z"/>
        </svg>`;
        var removeIcon = `<svg width="24" height="24" fill="red" viewBox="-47 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg">
            <path d="m416.875 114.441406-11.304688-33.886718c-4.304687-12.90625-16.339843-21.578126-29.941406-21.578126h-95.011718v
                -30.933593c0-15.460938-12.570313-28.042969-28.027344-28.042969h-87.007813c-15.453125 0-28.027343 12.582031-28.027343
                28.042969v30.933593h-95.007813c-13.605469 0-25.640625 8.671876-29.945313 21.578126l-11.304687 33.886718c-2.574219 7.714844-1.2695312
                16.257813 3.484375 22.855469 4.753906 6.597656 12.445312 10.539063 20.578125 10.539063h11.816406l26.007813 321.605468c1.933594 23.863282
                22.183594 42.558594 46.109375 42.558594h204.863281c23.921875 0 44.175781-18.695312 46.105469-42.5625l26.007812-321.601562h6.542969c8.132812
                0 15.824219-3.941407 20.578125-10.535157 4.753906-6.597656 6.058594-15.144531
                3.484375-22.859375zm-249.320312-84.441406h83.0625v28.976562h-83.0625zm162.804687 437.019531c-.679687 8.402344-7.796875 14.980469-16.203125
                14.980469h-204.863281c-8.40625 0-15.523438-6.578125-16.203125-14.980469l-25.816406-319.183593h288.898437zm-298.566406-349.183593
                9.269531-27.789063c.210938-.640625.808594-1.070313 1.484375-1.070313h333.082031c.675782 0 1.269532.429688 1.484375 1.070313l9.269531
                27.789063zm0 0"/><path d="m282.515625 465.957031c.265625.015625.527344.019531.792969.019531 7.925781 0 14.550781-6.210937
                14.964844-14.21875l14.085937-270.398437c.429687-8.273437-5.929687-15.332031-14.199219-15.761719-8.292968-.441406-15.328125 5.925782-15.761718
                14.199219l-14.082032 270.398437c-.429687 8.273438 5.925782 15.332032 14.199219 15.761719zm0 0"/>
            <path d="m120.566406 451.792969c.4375 7.996093 7.054688 14.183593 14.964844 14.183593.273438 0 .554688-.007812.832031-.023437 8.269531-.449219
                14.609375-7.519531 14.160157-15.792969l-14.753907-270.398437c-.449219-8.273438-7.519531-14.613281-15.792969-14.160157-8.269531.449219
                -14.609374 7.519532-14.160156 15.792969zm0 0"/><path d="m209.253906 465.976562c8.285156 0 15-6.714843 15-15v-270.398437c0-8.285156
                -6.714844-15-15-15s-15 6.714844-15 15v270.398437c0 8.285157 6.714844 15 15 15zm0 0"/>
        </svg>`;

        OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.ula);
        OrgChart.templates.myTemplate.size = [230, 90];
        OrgChart.templates.myTemplate.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="2" stroke="#eeeeee"></rect>
            <line x1="0" y1="2.5" x2="230" y2="2.5" stroke-width="5" stroke="#154C9C"></line>`;

        OrgChart.templates.myTemplate.field_0 = `<text width="180" text-overflow="multiline" style="font-size: 16px;" font-weight="bold" fill="#636363" x="15" y="49" text-anchor="start">{val}</text>`;
        OrgChart.templates.myTemplate.field_1 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="30" text-anchor="start">{val}</text>`;
        OrgChart.templates.myTemplate.field_2 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="68" text-anchor="start">{val}</text>`;
        OrgChart.templates.myTemplate.nodeMenuButton = `<g style="cursor:pointer;" transform="matrix(1,0,0,1,205,80)" data-ctrl-n-menu-id="{id}">
            <rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect>
            <circle cx="4" cy="0" r="2" fill="#636363"></circle><circle cx="9" cy="0" r="2" fill="#636363"></circle>
            <circle cx="14" cy="0" r="2" fill="#636363"></circle>
        </g>`;

        // bu2
        OrgChart.templates.bu2 = Object.assign({}, OrgChart.templates.myTemplate);
        OrgChart.templates.bu2.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="2" stroke="#eeeeee"></rect>
            <line x1="0" y1="2.5" x2="230" y2="2.5" stroke-width="5" stroke="#595BEA"></line>`;
        OrgChart.templates.bu2.field_0 = `<text width="180" text-overflow="multiline" style="font-size: 16px;" font-weight="bold" fill="#636363" x="15" y="49" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu2.field_1 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="30" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu2.field_2 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="68" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu2.field_7 = `<g><circle cx="145" cy="90" r="14" fill="#595BEA"></circle>
            <text x="145" y="95" data-width="230" data-text-overflow="multiline" style="font-size: 14px;" fill="#ffffff" text-anchor="middle">{val}</text></g>`;
        OrgChart.templates.bu2.plus = `<circle cx="14" cy="16" r="13" stroke-width="1" fill="#595BEA" stroke="#595BEA"></circle>
            <line x1="15" y1="10" x2="15" y2="20" stroke-width="2" stroke="#f0e2ea"></line>
            <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#f0e2ea"></line>`
        OrgChart.templates.bu2.minus = `<circle cx="15" cy="15" r="12" fill="#f0e2ea" stroke="#f0e2ea" stroke-width="1"></circle>
            <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#595BEA"></line>`;
        OrgChart.templates.bu2.link = `<path stroke-linejoin="round" stroke="#eeeeee" stroke-width="2" fill="none" d="{edge}" />`;

        // bu3
        OrgChart.templates.bu3 = Object.assign({}, OrgChart.templates.myTemplate);
        OrgChart.templates.bu3.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="2" stroke="#eeeeee"></rect>
            <line x1="0" y1="2.5" x2="230" y2="2.5" stroke-width="5" stroke="#9F49F1"></line>`;
        OrgChart.templates.bu3.field_0 = `<text width="180" text-overflow="multiline" style="font-size: 16px;" font-weight="bold" fill="#636363" x="15" y="49" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu3.field_1 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="30" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu3.field_2 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="68" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu3.field_7 = `<g><circle cx="145" cy="90" r="14" fill="#9F49F1"></circle>
            <text x="145" y="95" data-width="230" data-text-overflow="multiline" style="font-size: 14px;" fill="#ffffff" text-anchor="middle">{val}</text></g>`;


        OrgChart.templates.bu3.plus = `<circle cx="14" cy="16" r="13" stroke-width="1" fill="#9F49F1" stroke="#9F49F1"></circle>
            <line x1="15" y1="10" x2="15" y2="20" stroke-width="2" stroke="#f0e2ea"></line>
            <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#f0e2ea"></line>`
        OrgChart.templates.bu3.minus = `<circle cx="15" cy="15" r="12" fill="#f0e2ea" stroke="#f0e2ea" stroke-width="1"></circle>
            <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#9F49F1"></line>`;
        OrgChart.templates.bu3.link = `<path stroke-linejoin="round" stroke="#eeeeee" stroke-width="2" fill="none" d="{edge}" />`;

        // bu4
        OrgChart.templates.bu4 = Object.assign({}, OrgChart.templates.myTemplate);
        OrgChart.templates.bu4.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="2" stroke="#eeeeee"></rect>
            <line x1="0" y1="2.5" x2="230" y2="2.5" stroke-width="5" stroke="#FF68AE"></line>`;
        OrgChart.templates.bu4.field_0 = `<text width="180" text-overflow="multiline" style="font-size: 16px;" font-weight="bold" fill="#636363" x="15" y="49" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu4.field_1 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="30" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu4.field_2 = `<text width="210" text-overflow="multiline" style="font-size: 10px;" font-weight="bold" fill="#aeaeae" x="15" y="68" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu4.field_7 = `<g><circle cx="145" cy="90" r="14" fill="#FF68AE"></circle>
            <text x="145" y="95" data-width="230" data-text-overflow="multiline" style="font-size: 14px;" fill="#ffffff" text-anchor="middle">{val}</text></g>`;

        OrgChart.templates.bu4.plus = `<circle cx="14" cy="16" r="13" stroke-width="1" fill="#FF68AE" stroke="#FF68AE"></circle>
            <line x1="15" y1="10" x2="15" y2="20" stroke-width="2" stroke="#f0e2ea"></line>
            <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#f0e2ea"></line>`
        OrgChart.templates.bu4.minus = `<circle cx="15" cy="15" r="12" fill="#f0e2ea" stroke="#f0e2ea" stroke-width="1"></circle>
            <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#FF68AE"></line>`;
        OrgChart.templates.bu4.link = `<path stroke-linejoin="round" stroke="#eeeeee" stroke-width="2" fill="none" d="{edge}" />`;

        // กลุ่ม
        OrgChart.templates.group = Object.assign({}, OrgChart.templates.group);
        OrgChart.templates.group.size = [340, 150];
        OrgChart.templates.group.imgs = `{val}`;
        OrgChart.templates.group.img_0 = ``;
        OrgChart.templates.group.field_0 = OrgChart.templates.group.field_0
            .replace(/fill="[^"]+"/g, 'fill="#444444"')
            .replace(/ y="[^"]+"/g, ' y="30"');

        OrgChart.templates.group.link = `<path stroke-linejoin="round" stroke="#808080" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}" />`;
        OrgChart.templates.group.field_6 = `
            <g><circle cx="185" cy="-15" r="13" fill="#154C9C"></circle>
            <text x="185" y="-10" data-width="230" data-text-overflow="multiline" style="font-size: 14px;" fill="#ffffff" text-anchor="middle">{val}</text></g>`;
        // กลุ่ม

        // พนักงาน
        OrgChart.templates.empListTemplate = Object.assign({}, OrgChart.templates.olivia);
        OrgChart.templates.empListTemplate.size = [300, 120];
        OrgChart.templates.empListTemplate.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#FFFFFF" stroke-width="1" stroke="#154C9C" rx="12" ry="12"></rect>
            <circle cx="53" cy="70" r="45" fill="#d1d2d4" stroke="#fff" stroke-width="5"></circle>
            <circle stroke="#939598" stroke-width="2" fill="#939598" cx="54" cy="53" r="8"></circle>
            <path d="M41,80 C41,58 66,58 66,80 L40,80" stroke="#939598" stroke-width="2" fill="#939598"></path>`;

        OrgChart.templates.empListTemplate.field_2 = `<text data-width="250" class="field_2" style="font-size: 10px;" fill="#444444" x="20" y="20" text-anchor="start">รหัสพนักงาน:{val}</text>`;
        OrgChart.templates.empListTemplate.field_3 = `<text data-width="250" class="field_3" style="font-size: 16px; font-weight: bold;" fill="#154C9C" x="105" y="50" text-anchor="start">{val}</text>`;
        OrgChart.templates.empListTemplate.field_4 = `<text data-width="250" class="field_4" style="font-size: 14px;" fill="#154C9C" x="105" y="70" text-anchor="start">{val}</text>`;
        OrgChart.templates.empListTemplate.field_5 = `<text data-width="250" class="field_5" style="font-size: 12px;" fill="#444444" x="105" y="95" text-anchor="start">{val}</text>`;
        OrgChart.templates.empListTemplate.img_0 = `<clipPath id="ulaImg"><circle cx="53" cy="70" r="45"></circle></clipPath>
            <image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="8" y="25" width="90" height="90"></image>`;

        OrgChart.templates.empListTemplate.nodeMenuButton = `<g style="cursor:pointer;" transform="matrix(1,0,0,1,275,40)" data-ctrl-n-menu-id="{id}">
               <rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect>
               <circle cx="15" cy="10" r="3" fill="#939598"></circle>
               <circle cx="15" cy="18" r="3" fill="#939598"></circle>
               <circle cx="15" cy="26" r="3" fill="#939598"></circle>
             </g>`;
         function createTemplate(baseTemplate: any, strokeColor: string, size: [number, number] = [300, 120]) {
                    const newTemplate = Object.assign({}, baseTemplate);
                    newTemplate.size = size; // ตั้งค่า size
                    newTemplate.node = baseTemplate.node.replace(/stroke="#154C9C"/g, `stroke="${strokeColor}"`);
                    return newTemplate;
                }
                // สร้าง templates จาก myTemplate
                OrgChart.templates.empListOrg1 = createTemplate(OrgChart.templates.empListTemplate, "#446AC5");
                OrgChart.templates.empListOrg2 = createTemplate(OrgChart.templates.empListTemplate, "#E93C8D");
                OrgChart.templates.empListOrg3 = createTemplate(OrgChart.templates.empListTemplate, "#F9782E");
                OrgChart.templates.empListOrg4 = createTemplate(OrgChart.templates.empListTemplate, "#E7A927");
                OrgChart.templates.empListOrg5 = createTemplate(OrgChart.templates.empListTemplate, "#1DBE5A");
                OrgChart.templates.empListOrg6 = createTemplate(OrgChart.templates.empListTemplate, "#569BF5");
                OrgChart.templates.empListOrg7 = createTemplate(OrgChart.templates.empListTemplate, "#9AC5FD");
        // พนักงาน

        // บริษัท
        OrgChart.templates.bu1 = Object.assign({}, OrgChart.templates.olivia);
        OrgChart.templates.bu1.size = [360, 120];
        OrgChart.templates.bu1.node = `<rect x="0" y="0" height="120" width="360" fill="#FFFFFF" stroke-width="1" stroke="#aeaeae" rx="12" ry="12"></rect>`;
        OrgChart.templates.bu1.field_0 = `<text data-width="250" class="field_0" style="font-size: 18px; font-weight: bold;" fill="#444444" x="115" y="55" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu1.field_1 = `<text data-width="250" class="field_1" style="font-size: 14px;" fill="#000000" x="115" y="75" text-anchor="start">{val}</text>`;
        OrgChart.templates.bu1.field_7 = `<g><circle cx="210" cy="120" r="14" fill="#595BEA"></circle>
            <text x="210" y="125" data-width="230" data-text-overflow="multiline" style="font-size: 14px;" fill="#ffffff" text-anchor="middle">{val}</text></g>`;
        OrgChart.templates.bu1.nodeMenuButton = `<g style="cursor:pointer;" transform="matrix(1,0,0,1,330,40)" data-ctrl-n-menu-id="{id}">
       <rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect>
       <circle cx="15" cy="10" r="3" fill="#939598"></circle>
       <circle cx="15" cy="18" r="3" fill="#939598"></circle>
       <circle cx="15" cy="26" r="3" fill="#939598"></circle>
     </g>`;

        OrgChart.templates.bu1.plus = `<circle cx="14" cy="16" r="13" stroke-width="1" fill="#595BEA" stroke="#595BEA"></circle>
            <line x1="15" y1="10" x2="15" y2="20" stroke-width="2" stroke="#f0e2ea"></line>
            <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#f0e2ea"></line>`
        OrgChart.templates.bu1.minus = `<circle cx="15" cy="15" r="12" fill="#f0e2ea" stroke="#f0e2ea" stroke-width="1">{val}</circle>
        <line x1="10" y1="15" x2="20" y2="15" stroke-width="2" stroke="#595BEA"></line>`;
        OrgChart.templates.bu1.link = `<path stroke-linejoin="round" stroke="#eeeeee" stroke-width="2" fill="none" d="{edge}" />`;
        //     //
        this.chart = new OrgChart(document.getElementById("tree")!, {
            nodes: this.chartList,
            enableSearch: true, //ค้นหา
            // template: "myTemplate",
            toolbar: {
                zoom: true,
                fullScreen: true,
                fit: true,
                expandAll: true,
                layout: true,
            },
            nodeBinding: {
                field_0: "tdesc",
                field_1: "edesc",
                field_2: "id",
                field_3: "name",
                field_4: "nameEng",
                field_5: "position",
                img_0: "img",
                field_6: "field_6",
                field_7: "numEmp",
                field_8: "plId",
            },
            tags: {
                bu1: { template: "bu1" },
                bu2: { template: "bu2" },
                bu3: { template: "bu3" },
                bu4: { template: "bu4" },
                group: { template: "group", subTreeConfig: { columns: 1 } },
                empListTemplate: { template: "empListTemplate" },
                empListOrg1: { template: "empListOrg1" },
                empListOrg2: { template: "empListOrg2" },
                empListOrg3: { template: "empListOrg3" },
                empListOrg4: { template: "empListOrg4" },
                empListOrg5: { template: "empListOrg5" },
                empListOrg6: { template: "empListOrg6" },
                empListOrg7: { template: "empListOrg7" },
            },
            nodeMenu: {
                details: {
                    text: "Details", icon: detailsIcon,
                    onClick: (nodeId: string) => {
                        const node = this.chartList.find((n: any) => n.id === nodeId); // ค้นหาโหนด
                        if (node) {
                            // console.log("eiei  node:", node)
                            if (node.level == 6) {
                                this.newEmp = { ...node, fname: node.name.split(" ")[0], lname: node.name.split(" ")[1] || '', efname: node.nameEng.split(" ")[0], elname: node.nameEng.split(" ")[1] || '' }; // เก็บข้อมูลโหนดที่เลือก
                                this.ngbModal.open(this.detailEmpModal, { centered: true, size: "lg" }); // เปิด Modal
                            } else {
                                this.selectedNode = node; // เก็บข้อมูลโหนดที่เลือก
                                this.ngbModal.open(this.modalDetail, { centered: true, size: "lg" }); // เปิด Modal
                            }
                        }
                    }
                },
                edit: {
                    text: "Edit", icon: editIcon,
                    onClick: (nodeId: string) => {
                        const node = this.chartList.find((n: any) => n.id === nodeId); // ค้นหาโหนด
                        if (node) {
                            // const tags = this.PLCheck(node.plId); // ดึง tags จาก plId
                            if (node.level == 6) {
                                this.newEmp = { ...node, fname: node.name.split(" ")[0], lname: node.name.split(" ")[1] || '', efname: node.nameEng.split(" ")[0], elname: node.nameEng.split(" ")[1] || ''}; // เก็บข้อมูลโหนดที่เลือก
                                this.ngbModal.open(this.editEmpModal, { centered: true, size: "lg" }); // เปิด Modal
                            } else {
                                // console.log("eiei  node:", node)
                                this.selectedNode = node; // เก็บข้อมูลโหนดที่เลือก
                                this.ngbModal.open(this.modalEdit, { centered: true, size: "lg" }); // เปิด Modal
                            }
                        }
                    }
                },
                add: {
                    text: "Add", icon: addIcon,
                    onClick: (nodeId: string) => {
                        const node = this.chartList.find((n: any) => n.id === nodeId); // ค้นหาโหนด
                        const tagMap = ["bu2", "bu3", "bu4", "group",];
                        // เซ็ตค่า newEmp ให้เป็นค่าว่าง

                        if (node && (node.level >= 1 && node.level <= 4) && node.level <= tagMap.length) {
                            const newNode = {
                                id: `${this.chartList.length + 1}`,
                                pid: node.id,
                                tdesc: "กรุณากรอกข้อมูล",
                                edesc: "กรุณากรอกข้อมูล",
                                tags: Array.isArray(tagMap[node.level - 1])
                                    ? tagMap[node.level - 1]
                                    : [tagMap[node.level - 1]],
                                level: node.level + 1,
                                img: "",
                                numEmp: 0
                            };
                            console.log("eiei  newNode:", newNode);
                            this.addNode(newNode);
                        } else if (node && node.level === 5) {
                            this.ngbModal.open(this.addEmpModal, { centered: true, size: "lg" }); // เปิด Modal
                            this.setBuValues(nodeId); // ตั้งค่า Bu ก่อน
                        }
                    },
                },
                remove: {
                    text: "Remove",
                    icon: removeIcon,
                    onClick: (nodeId: string) => {
                        const node = this.chart.getNode(nodeId);
                        if (this.hasChildren(node)) {
                            this.openAlertModal(this.translateService.instant("ไม่สามารถลบได้"));
                        } else {
                            // ลบ Node ออกจาก chartList
                            this.chartList = this.chartList.filter((n: any) => n.id !== nodeId);
                            // อัปเดตค่า numEmp ของ Node ที่เหลือ
                            this.chartList = this.chartList.map((node: any) => ({ ...node, numEmp: this.chartListCheckEmp(node.id), })); // คำนวณใหม่
                            // ลบ Node ออกจาก OrgChart
                            this.chart.removeNode(nodeId);
                            // โหลดข้อมูลที่อัปเดตกลับเข้าสู่ OrgChart
                            this.chart.load(this.chartList);
                        }
                    },
                },
            },
            menu: {
                pdf: { text: "Export PDF" },
                png: { text: "Export PNG" },
                svg: { text: "Export SVG" },
                csv: { text: "Export CSV" },
            },
            searchFields: ["tdesc", "edesc"],
            enableDragDrop: true,
            nodeMouseClick: OrgChart.action.none,
        });

        this.chart.on('field', function (sender: any, args: any) {
            if (args.node.tags.indexOf("group") != -1) { // ตรวจสอบว่าเป็น group
                if (args.name === "field_6") {
                    let count = args.node.stChildrenIds.length; // จำนวน node ใน group
                    // args.value = `จำนวน Node: ${count}`;
                    args.value = `${count}`;
                }
            }
        });

        this.chart.on('field', function (sender: any, args: any) {
            function countStChildrenIds(children: any[]): number {
                let count = 0;
                children.forEach((child: any) => {
                    if (child.stChildrenIds) {
                        count += child.stChildrenIds.length;
                    }
                    if (child.children) {
                        count += countStChildrenIds(child.children);
                    }
                });
                return count;
            }
            // ตรวจสอบว่าแท็กมี 'bu'
            if (args.node.tags.includes("bu") != -1) {
                // ตรวจสอบว่าเป็น field_7
                if (args.name === "field_7") {
                    // คำนวณจำนวน stChildrenIds โดยใช้ฟังก์ชัน countStChildrenIds
                    const num = countStChildrenIds(args.node.children);
                    // ตั้งค่า value ให้กับ args
                    args.value = `จำนวน คน: ${num}`;
                }
            }
        });

        // เช็ค Drag AND Drop
        this.chart.onDrop((args: any) => {
            const dataDrag = this.chartList.find((e: any) => e.id == args.dragId);
            const dataDrop = this.chartList.find((e: any) => e.id == args.dropId);
            if (dataDrag.level != dataDrop.level + 1) {
                // ถ้าไม่ผ่านเงื่อนไข ให้แสดงการแจ้งเตือน
                this.openAlertModal(this.translateService.instant("ไม่สามารถวางตำแหน่งนี้ได้"));
                return false;
            }
            // อัปเดตค่า pid ของ Node ที่ลาก
            dataDrag.pid = dataDrop.id;
            // อัปเดต `numEmp` ของ Node ที่เกี่ยวข้อง
            this.chartList = this.chartList.map((node: any) => ({ ...node, numEmp: this.chartListCheckEmp(node.id), }));// คำนวณใหม่
            // รีเฟรชกราฟ
            this.chart.load(this.chartList);
            // ถ้าผ่านเงื่อนไข
            return true;
        });

        // เช็ค Drag AND Drop ระหว่าง Group
        this.chart.on("drop", (sender: any, draggedNodeId: any, droppedNodeId: any) => {
            const draggedNode = sender.getNode(draggedNodeId);
            const droppedNode = sender.getNode(droppedNodeId);
            if (droppedNode.tags.indexOf("group") != -1 && draggedNode.tags.indexOf("group") == -1) {
                const draggedNodeData = sender.get(draggedNode.id);
                draggedNodeData.pid = null;
                draggedNodeData.stpid = droppedNode.id;
                // อัปเดต Node ใน OrgChart
                sender.updateNode(draggedNodeData);
                // อัปเดตข้อมูลใน chartList
                const draggedIndex = this.chartList.findIndex((node: any) => node.id === draggedNodeId);
                if (draggedIndex > -1) {
                    this.chartList[draggedIndex].stpid = droppedNode.id;
                }
                // คำนวณค่า `numEmp` ใหม่
                this.chartList = this.chartList.map((node: any) => ({ ...node, numEmp: this.chartListCheckEmp(node.id), }));
                // อัปเดตใน OrgChart
                this.chart.load(this.chartList);
                return false;
            }
        });

        // คลิก Node แล้วเปิด modalDetail
        this.chart.onNodeClick((args: any) => {
            const nodeOnClickFromChart = args.node; // ข้อมูลจากแผนผัง
            const chartList = this.chartList.find((n: any) => n.id === nodeOnClickFromChart.id); // ข้อมูลจาก chartList
            if (chartList) {
                if (chartList.level == 6) {
                    this.newEmp = { ...chartList, fname: chartList.name.split(" ")[0], lname: chartList.name.split(" ")[1] || '', efname: chartList.nameEng.split(" ")[0], elname: chartList.nameEng.split(" ")[1] || '' }; // เก็บข้อมูลโหนดที่เลือก
                    this.ngbModal.open(this.detailEmpModal, { centered: true, size: "lg" });
                } else {
                    // console.log("ข้อมูลเต็มของโหนด:", chartList);
                    this.selectedNode = chartList;
                    this.ngbModal.open(this.modalDetail, { centered: true, size: "lg" });
                }
            } else {
                console.warn("ไม่พบโหนดใน chartList");
            }
        });

        this.chart.on('click', function (sender: any, args: any) {
        });

    }

    // ตรวจสอบว่ามี node อื่นที่มี pid ตรงกับ id ของ node นี้
    hasChildren(node: any): boolean {
        return this.chartList.some((n: any) => n.pid === node.id || n.stpid === node.id);
    }

    // เพิ่ม node ใหม่ใน chartList
    addNode(newNode: any) {
        if (newNode.level == 1) {
            newNode.tags = ["bu1"];
        } else if (newNode.level == 2) {
            newNode.tags = ["bu2"];
        } else if (newNode.level == 3) {
            newNode.tags = ["bu3"];
        } else if (newNode.level == 4) {
            newNode.tags = ["bu4"];
        } else if (newNode.level == 5) {
            newNode.tags = ["group"];
        }
        if (!newNode.pid) {
            newNode.pid = "";
        }
        // เพิ่ม Node ลงใน chartList
        this.chartList.push(newNode);
        // คำนวณ `numEmp` ใหม่
        this.chartList = this.chartList.map((node: any) => ({ ...node, numEmp: this.chartListCheckEmp(node.id), }));
        // เพิ่ม Node ลงใน OrgChart
        this.chart.addNode(newNode);
        console.log("newNode:", newNode);
        console.log("updated chartList:", this.chartList);
    }

    addNewEmp(newEmp: any) {
        // แปลงข้อมูลก่อนเพิ่มลงใน orgChart
        const tags = this.PLCheck(newEmp.plId); // ใช้ฟังก์ชัน PLCheck
        const newEmpNode = {
            id: newEmp.id,
            name: `${newEmp.fname} ${newEmp.lname}`,
            nameEng: `${newEmp.efname} ${newEmp.elname}`,
            position: newEmp.position,
            img: newEmp.picture,
            bu1: newEmp.bu1 || "",
            bu2: newEmp.bu2 || "",
            bu3: newEmp.bu3 || "",
            bu4: newEmp.bu4 || "",
            bu5: newEmp.bu5 || "",
            // bu5: newEmp.parent?.tdesc || "",
            plId: newEmp.plId,
            // stpid: newEmp.parent?.bu5id || "",
            stpid: newEmp.stpid || "",
            tags: tags,
            level: 6
        };
        // เพิ่ม node ลงใน chartList
        this.chartList.push(newEmpNode);
        // คำนวณ `numEmp` ใหม่สำหรับทุก Node ที่เกี่ยวข้อง
        this.chartList = this.chartList.map((node: any) => ({ ...node, numEmp: this.chartListCheckEmp(node.id), }));// คำนวณใหม่
        // เพิ่ม Node ลงใน OrgChart
        this.chart.addNode(newEmpNode);
        // รีเฟรช OrgChart ด้วยข้อมูลที่อัปเดต
        this.chart.load(this.chartList);
        // console.log("updated chartList:", this.chartList);
    }

    setBuValues(nodeId: string) {
        // ดึงโหนดทั้งหมดที่เกี่ยวข้อง (โหนดปัจจุบัน + โหนดก่อนหน้า)
        const getAllParentNodes = (nodeId: string, chartList: any[]) => {
            const parents = [];
            let currentNode = chartList.find((n: any) => n.id === nodeId);

            while (currentNode && currentNode.pid) {
                const parentNode = chartList.find((n: any) => n.id === currentNode.pid);
                if (parentNode) {
                    parents.unshift(parentNode); // ใส่ค่าไว้ด้านหน้าของลิสต์
                    currentNode = parentNode;
                } else {
                    break;
                }
            }
            return parents;
        };
        const allNodes = getAllParentNodes(nodeId, this.chartList);
        const currentNode = this.chartList.find((n: any) => n.id === nodeId);
        if (currentNode) allNodes.push(currentNode); // รวมโหนดปัจจุบันด้วย
        this.newEmp = {
            id: "",
            name: "",
            nameEng: "",
            position: "",
            img: "",
            bu1: allNodes[0]?.tdesc || '', // Bu1 = โหนดระดับสูงสุด
            bu2: allNodes[1]?.tdesc || '', // Bu2
            bu3: allNodes[2]?.tdesc || '', // Bu3
            bu4: allNodes[3]?.tdesc || '', // Bu4
            bu5: allNodes[4]?.tdesc || '', // Bu5
            plId: 1,
            stpid: allNodes[4]?.id || '', // ใช้ id ของโหนด Bu5
            tags: [''],
            level: 6,
            fname: "",
            lname: "",
            efname: "",
            elname: "",
        }
    }

    updateNode(data: string) {
        // if (this.selectedNode) {
        const modalRef = this.ngbModal.open(ConfirmModalComponent, { centered: true, });
        modalRef.componentInstance.message = this.translateService.instant("คุณต้องการแก้ไขข้อมูลใช่หรือไม่?");
        modalRef.componentInstance.confirmModal = true;
        modalRef.result.then((response) => {
            if (response) {
                let newdata = undefined
                if (data == "newEmp") {
                    newdata = {
                        ...this.newEmp,
                        tags: this.PLCheck(this.newEmp.plId) // ใช้ PLCheck เพื่อกำหนด tags
                    };
                    // newdata = this.newEmp
                } else if (data == "selectedNode") {
                    newdata = this.selectedNode
                }
                this.chart.updateNode(newdata); // อัพเดท Node ในแผนผัง
                // console.log(data);
                this.openAlertModal(this.translateService.instant("แก้ไขข้อมูลสำเร็จ"))
            }
            console.log("updateNode : ",this.chartList);

        }, reason => {
        })
        // }
    }

    // getListBuAll() {
    //     forkJoin({
    //         getBu1: this.org.getBu1(),
    //         getBu2: this.org.getBu2(),
    //         getBu3: this.org.getBu3(),
    //         getBu4: this.org.getBu4(),
    //         getBu5: this.org.getBu5(),
    //     }).subscribe(response => {
    //         const processBu = (buData: any, tag: any, level: any) =>
    //             buData.map((m: any) => ({
    //                 id: m[`${tag}id`],
    //                 pid: m.parent ? m.parent : "NONE",
    //                 tdesc: m.tdesc,
    //                 edesc: m.edesc,
    //                 tags: [tag],
    //                 img: m.img,
    //                 level: level
    //             }));

    //         this.chartList = [
    //             ...processBu(response.getBu1, "bu1", 1),
    //             ...processBu(response.getBu2, "bu2", 2),
    //             ...processBu(response.getBu3, "bu3", 3),
    //             ...processBu(response.getBu4, "bu4", 4),
    //             ...processBu(response.getBu5, "bu5", 5).map((item: any) => ({ ...item, tags: [...item.tags, "group"], })),
    //         ];
    //         this.bu1List = response.getBu1
    //         this.bu2List = response.getBu2
    //         this.bu3List = response.getBu3
    //         this.bu4List = response.getBu4
    //         this.bu5List = response.getBu5
    //         // console.log("eiei  this.chartList:", this.chartList)
    //         this.getEmpData();
    //     })
    // }

    getEmpData() {
        this.loadDatasource()
            .pipe(
                // tap((arr) => console.log("multi response", arr)),
                switchMap((arr) => { return from(arr); }),
                map((m: any) => {
                    const boss = m.bossId != null && m.bossId != m.employeeId ? m.bossId : "NONE";
                    const tags = this.PLCheck(m.plId); // ใช้ฟังก์ชัน PLCheck
                    return {
                        tdesc: m.tdesc,
                        edesc: m.edesc,
                        pid: m.pid,
                        id: m.id,
                        // pid: "",
                        name: m.name,
                        nameEng: m.nameEng,
                        position: m.position,
                        img: m.img,
                        bu1: m.bu1,
                        bu2: m.bu2,
                        bu3: m.bu3,
                        bu4: m.bu4,
                        bu5: m.bu5,
                        plId: m.plId,
                        stpid: m.stpid,
                        tags: m.tags,
                        // tags: ["empListTemplate"],
                        level: m.level

                    };
                }),
                reduce((s: any[], c) => s.concat(c), [])
            )
            .subscribe((response: any) => {
                // console.log("chart data", response);
                this.chartList = this.chartList.concat(response);
                this.chartList.sort(function (a: any, b: any) {
                    var keyA = a.plId,
                        keyB = b.plId
                    // Compare the 2 dates
                    if (keyA > keyB) return -1;
                    if (keyA < keyB) return 1;
                    return 0;
                });
                console.log("eiei 1 this.chartList:", this.chartList)
                // this.chartList = this.chartList.map((x: any) => ({ ...x, numEmp: this.chartListCheckEmp(x.id) }))
                // console.log("eiei 2 this.chartList:", this.chartList)
                this.initChart();
                this.loading = false;
            });
    }

    loadDatasource(): Observable<any[]> {
        return this.org.getData().pipe(
            switchMap((res: any) => {
                // console.log("res", res);
                const req$ = Array.apply(null, Array(res["totalPages"])).map(
                    (e, index) => { return this.org.getData(); });
                // console.log("req$", req$);
                return forkJoin(req$).pipe(
                    map((response: any) => {
                        let data: any[] = [];
                        response.forEach((x: any) => { data = data.concat(x); });
                        return data;
                    })
                );
            })
        );
    }
    // เช็ค PL
    PLCheck(plId: any): string[] {
        if (plId === 1) {
            return ["empListOrg1"];
        } else if (plId === 2) {
            return ["empListOrg2"];
        } else if (plId === 3) {
            return ["empListOrg3"];
        } else if (plId === 4) {
            return ["empListOrg4"];
        } else if (plId === 5){
            return ["empListOrg5"];
        } else if (plId === 6){
            return ["empListOrg6"];
        } else if (plId === 7){
            return ["empListOrg7"];
        } else  {
            return ["empListOrg1"];
        }
    }

    filterBu(buData: string, parent: string) {
        const buArray = (this as any)[`bu${buData}List`];
        return buArray?.filter((x: any) => !parent || x.parent === parent) || []
    }

    postcharlist() {
        const chartList: OrgData1[] = this.chartList.map((item: any) => ({
            companyId: item.companyId, // ใส่ค่า default ถ้าไม่มี
            nameTh: item.nameTh,
            nameEng: item.nameEng,
            title: item.title,
            level: item.level,
            stpId: item.stpid, // ระวัง key ที่ไม่ตรงกัน เช่น 'stpid' -> 'stpId'
            img: item.img,
            tags: item.tags,
            orderNo: 0,
            id: item.id,
            pid: item.pid,
            position: item.position,
        }));

        const modalRef = this.ngbModal.open(ConfirmModalComponent, { centered: true, });

        modalRef.componentInstance.message = this.translateService.instant("Do you want to save data ?");
        modalRef.componentInstance.confirmModal = true;
        modalRef.result.then((respone) => {
            this.org.postcharlist(chartList).subscribe((response: any) => {
                if (response) {
                    this.openAlertModal(this.translateService.instant(response.message))
                    this.ngOnInit();
                }
            }, (error) => {
                this.openAlertModal(this.translateService.instant(error.message))
            }
            );
        }, reason => {
        })
    }

    reset() {
        const modalRef = this.ngbModal.open(ConfirmModalComponent, { centered: true, });
        modalRef.componentInstance.message = this.translateService.instant("คุณต้องการรีเซ็ตใช่หรือไม่?");
        modalRef.componentInstance.confirmModal = true;
        modalRef.result.then((response) => {
            if (response) {
                this.ngOnInit();
                this.openAlertModal(this.translateService.instant("รีเซ็ตเรียบร้อย"))
            }
        }, reason => {
        })
    }

    openAlertModal(message?: string) {
        const modalRef = this.ngbModal.open(AlertModalComponent, { centered: true, backdrop: 'static' })
        modalRef.componentInstance.message = message ? message : ""
        modalRef.result.then((result) => {
            this.ngbModal.dismissAll()
        }, (reason) => {
            this.ngbModal.dismissAll()
        })
    }

    // เปิด Modal Add
    openModal(modal: string) {
        this.newNode = {
            id: "",
            pid: "",
            tdesc: "",
            edesc: "",
            // title: "",
            position: "",
            tags: [],
            level: 1,
            numEmp: 0
            // stpid: "",
        };

        this.newEmp = {
            id: "",
            name: "",
            nameEng: "",
            position: "",
            img: "",
            bu1: "",
            bu2: "",
            bu3: "",
            bu4: "",
            bu5: "",
            plId: 1,
            stpid: "",
            tags: [''],
            level: 6,
            fname: "",
            lname: "",
            efname: "",
            elname: "",

        }
        const modalRef = this.ngbModal.open(modal, { centered: true, size: "lg", });
        modalRef.result.then((result) => {

        }, reason => { }
        );
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
