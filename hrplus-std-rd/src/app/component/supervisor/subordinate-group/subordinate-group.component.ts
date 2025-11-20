import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SupEmpGroupContent } from 'src/app/models/empGroup.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { TimeService } from 'src/app/services/time.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyWorkingsModel, WorkingsModel } from 'src/app/models/workingmodel.model';
import { workflowService } from 'src/app/services/workflow.service';
import { MySubordinateModel, SubordinateModel } from 'src/app/models/subordinatelist.model';
import { Employee, MyEmployee } from 'src/app/models/employee.model';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule],
    selector: 'app-subordinate-group',
    templateUrl: './subordinate-group.component.html',
    styleUrls: ['./subordinate-group.component.scss']
})
export class SubordinateGroupComponent implements OnInit {
    @ViewChild('alertModal') alertModal: undefined;
    @ViewChild('confirmModal') confirmModal: undefined;
    pageModal = 1;
    pageSizeModal = 10;
    collectionSizeModal = 0;

    _groupid = ""
    subordinateDesc = { tdesc: "", edesc: "" }
    subordinateListSearch = ""
    subordinateList: SubordinateModel[] | undefined
    subordinateListShow: SubordinateModel[] = []
    noData = false
    _searchTerm = '';
    empNumid: string | undefined;
    page = 1;
    pageSize = 10;
    collectionSize = 0;
    loading = false;
    isSaving = false; // Added isSaving property
    firstData = true
    empHr: any;
    empHrSelectAdd: Employee | undefined;
    empHrShow: Employee[] = [];
    empHrShowlist: Employee[] = [];
    empHrSelect: Employee | undefined;

    empList: Array<Employee> = [];
    model: SupEmpGroupContent | undefined;
    lastPage = false;
    msg = "";
    empCheckbox: { empid: any, select: boolean }[] = []
    empCheckboxlist: { empid: any, select: boolean }[] = []
    selectsubordinateList: SubordinateModel | undefined
    empSelectListCheck = [{ check: false, num: 0 }]

    _groupidAdd = ""
    subordinateDescAddtdesc = ""
    subordinateDescAddedesc = ""
    namecheck = ""
    checkdelete = false
    constructor(private modalService: NgbModal,
        public empService: EmployeeService,
        public cdr: ChangeDetectorRef,
        public timeService: TimeService,
        public datepipe: DatePipe,
        public translateService: TranslateService,
        public modal: NgbModal) {
        this.getSubordinate()
        this.getEmpHr()
    }
    openModal(content: string, name: string) {
        this.pageModal = 1;
        this.pageSizeModal = 10;
        this.collectionSizeModal = 0;
        if (name == "emplist") {
            this.empHrShowlist = []
            this.empCheckboxlist = []
            this.empHrShowlist = this.empList
            this.empList!.forEach(x => {
                this.empCheckboxlist.push({ empid: x, select: this.empHrShow.filter(y => y.employeeId == x.employeeId).length == 0 ? false : true })
            })
            this.collectionSizeModal = this.empHrShowlist.length;

        }
        if (name == "subordinatelist") {
            this.collectionSizeModal = this.subordinateListShow.length
        }
        if (name == "addsubordinatelist") {
            if (this._groupid) {
                this._groupidAdd = this._groupid
                this.subordinateDescAddtdesc = this.subordinateDesc.tdesc
                this.subordinateDescAddedesc = this.subordinateDesc.edesc
            }
        }
        this.modal.open(content, { centered: true, size: 'lg' });
    }
    ngOnInit(): void {

    }

    getSubordinate() {
        this.empService.getSubordinateList().then(result => {
            this.subordinateList = result.map(e => new MySubordinateModel(e, this.translateService)).sort((a: SubordinateModel, b: SubordinateModel) => (a.groupId! > b.groupId!) ? 1 : -1);
            this.subordinateListShow = this.subordinateList
            this.collectionSizeModal = this.subordinateListShow.length
            this.cdr.markForCheck()
        })
    }
    searchSubordinate() {
        this.subordinateListShow = this.subordinateList!.filter((x: any) => (x.tdesc.indexOf(this.subordinateListSearch) !== -1 || x.edesc.indexOf(this.subordinateListSearch) !== -1));
        this.pageModal = 1;
        this.collectionSizeModal = this.subordinateListShow.length
    }

    selectSubordinate(item: SubordinateModel) {
        this._groupid = item.groupId!
        this.subordinateDesc.tdesc = item.tdesc!
        this.subordinateDesc.edesc = item.edesc!
        this.selectsubordinateList = item
        this.empHrShow = []
        this.empCheckbox = []
        this.loading = true

        if (this.selectsubordinateList) {
            this.checkdelete = true
            this.selectsubordinateList!.subData.split(' ').join('').split("'").join('').split(',').forEach(xempID => {
                if (this.empList.filter(y => y.employeeId == xempID).length > 0) {
                    this.empHrShow.push(this.empList.filter(y => y.employeeId == xempID)[0])
                    this.empCheckbox.push({ empid: this.empList.filter(y => y.employeeId == xempID)[0], select: false })
                }
            })

            this.collectionSize = this.empHrShow.length;
            this.firstData = false
            this.loading = false
        }

    }



    changeSubordinate() {
        if (this.subordinateList!.filter(x => x.groupId.toLowerCase() == this._groupid.toLowerCase()).length == 1) {
            this._groupid = this.subordinateList!.filter(x => x.groupId.toLowerCase() == this._groupid.toLowerCase())[0].groupId!
            this.selectSubordinate(this.subordinateList!.filter((x: SubordinateModel) => (x.groupId! == this._groupid))[0])
            this.checkdelete = true
        } else {
            this.empHrShow = []
            this.subordinateDesc = { tdesc: "", edesc: "" }
            this.checkdelete = false
        }
    }

    addSubordinate() {
        this.isSaving = true; // Set isSaving to true
        let token = JSON.parse(sessionStorage.getItem('currentUser')!)
        this.selectsubordinateList = new MySubordinateModel({
            employeeId: token.employeeid,
            groupId: this._groupidAdd,
            tdesc: this.subordinateDescAddtdesc,
            edesc: this.subordinateDescAddedesc,
            subData: "",
        }, this.translateService)
        this._groupid = this._groupidAdd
        this.subordinateDesc = { tdesc: this.subordinateDescAddtdesc, edesc: this.subordinateDescAddedesc }
        this.empHrShow = []
        if (this.subordinateList!.filter(x => x.groupId.toLowerCase() == this._groupidAdd.toLowerCase()).length == 1) {
            this._groupid = this.subordinateList!.filter(x => x.groupId.toLowerCase() == this._groupidAdd.toLowerCase())[0].groupId!
            this.selectSubordinate(this.subordinateList!.filter((x: SubordinateModel) => (x.groupId! == this._groupid))[0])
            this.selectsubordinateList = new MySubordinateModel({
                employeeId: token.employeeid,
                groupId: this._groupidAdd,
                tdesc: this.subordinateDescAddtdesc,
                edesc: this.subordinateDescAddedesc,
                subData: "",
            }, this.translateService)
            this._groupid = this._groupidAdd
            this.subordinateDesc = { tdesc: this.subordinateDescAddtdesc, edesc: this.subordinateDescAddedesc }
        }
        this.isSaving = false; // Reset isSaving on success/error
    }

    selectAllEmp(event: boolean) {
        this.empCheckbox.map(x => x.select = event)
    }
    selectAllEmpList(event: boolean) {
        this.empCheckboxlist.map(x => x.select = event)
    }

    deleteEmp() {
        this.isSaving = true; // Set isSaving to true
        this.empCheckbox.forEach((x, i) => {
            if (x.select) {
                this.empHrShow.splice(i, 1)
                this.empCheckbox.splice(i, 1)
                this.deleteEmp()
            }
        })
        this.isSaving = false; // Reset isSaving immediately for local operation
    }
    selectEmp() {
        this.empHrShow = []
        this.empCheckbox = []
        this.empCheckboxlist.filter(x => x.select == true).forEach((x, i) => {
            this.empHrShow[i] = x.empid
            this.empCheckbox.push({ empid: x.empid, select: false })
        })
        this.collectionSize = this.empHrShow.length;
    }

    get searchTerm(): string {
        return this._searchTerm;
    }
    set searchTerm(val: string) {
        this._searchTerm = val;
        if (this.empHrShowlist) {
            this.empHrShowlist = this.filterName(val);
            if (this.empHrShowlist!.length == 0) {
                this.noData = true;
            } else {
                this.noData = false;
            }
            //   this.page = 1;
            //   this.collectionSize = this.empHrShowlist.length;
        }
    }
    filterName(v: string) {
        return this.empList!.filter((x: any) => (x.getFullname().toLowerCase().indexOf(v) !== -1));
    }

    getEmpHr() {
        this.empService.getSupEmpList("",1000,0).then((result:any) => {
            this.empList = result.content.map(e => new MyEmployee(e, this.translateService)).sort((a: any, b: any) => (a.employeeId! > b.employeeId!) ? 1 : -1)
            this.cdr.markForCheck();
        }).catch((reason) => {
            this.lastPage = true;
            this.msg = reason.message;
            this.modalService.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            });
        });
    }

    onSubmit(name: string) {
        this.isSaving = true; // Set isSaving to true
        let emloyeelist: string[] = [];
        this.empHrShow.forEach(x => {
            emloyeelist.push(x.employeeId!)
        })
        let body = {
            employeeId: this.selectsubordinateList?.employeeId,
            groupId: this.selectsubordinateList?.groupId,
            tdesc: this.selectsubordinateList?.tdesc,
            edesc: this.selectsubordinateList?.edesc,
            subData: "'" + emloyeelist.join("','") + "'"
        }
        console.log(body)
        if (name == "add") {
            this.empService.postSubordinateList(body).then((result: any) => {
                if (result) {
                    this.msg = this.translateService.currentLang == 'th' ? 'บันทึกข้อมูลเรียบร้อย' : 'Save data completely'
                    this.modalService.open(this.alertModal, {
                        centered: true,
                        backdrop: 'static'
                    })
                    this.getSubordinate()
                }
                this.isSaving = false; // Reset isSaving on success
            })
        }
        if (name == "delete") {
            this.empService.deleteSubordinateList(body).then((result: any) => {
                if (result) {
                    this.msg = this.translateService.currentLang == 'th' ? 'บันทึกข้อมูลเรียบร้อย' : 'Save data completely'
                    this.modalService.open(this.alertModal, {
                        centered: true,
                        backdrop: 'static'
                    })
                    window.location.reload();
                }
                this.isSaving = false; // Reset isSaving on success
            })
        }

    }
    openOnSubmit(name: string) {
        this.isSaving = true; // Set isSaving to true
        if (name == 'add') {
            this.namecheck = name
            this.msg = this.translateService.currentLang == 'th' ? 'ต้องการแก้ไขข้อมูลหรือไม่ ?' : 'Do you want to update data or not?'
        }
        if (name == 'delete') {
            this.namecheck = name
            this.msg = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to delete data or not?'
        }
        this.modalService.open(this.confirmModal, {
            centered: true,
            backdrop: "static",
        }).result.then(
            (result) => {
            },
            (reason) => {
                if(reason == 'Close'){
                    this.namecheck = ''
                }
                this.isSaving = false; // Reset isSaving if modal dismissed
            },
        );
    }

}