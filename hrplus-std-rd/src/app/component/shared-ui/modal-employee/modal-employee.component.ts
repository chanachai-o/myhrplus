import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BranchModel } from 'src/app/models/branchmodel.model';
import { DegreeModel } from 'src/app/models/degreemodel.model';
import { FacultyModel } from 'src/app/models/facultymodel.model';
import { InstitueModel } from 'src/app/models/instituemodel.model';
import { JobcodeModel } from 'src/app/models/jobcodemodel.model';
import { LangSkillModel } from 'src/app/models/langskillmodel.model';
import { NationalityModel } from 'src/app/models/nationalitymodel.model';
import { NationalModel } from 'src/app/models/nationalmodel.model';
import { OccupationModel } from 'src/app/models/occupationmodel.model';
import { PaperListModel } from 'src/app/models/paperlistmodel.model';
import { PrefixModel } from 'src/app/models/prefixmodel.model';
import { MajorModel, RecruitApplicantModel, ZipcodeModel } from 'src/app/models/recruitapplicant.model';
import { FamilyralationModel } from 'src/app/models/relationmdel.model';
import { ReligionModel } from 'src/app/models/religionmodel.model';
import { SourcejobModel } from 'src/app/models/soureJobmodel.model';
import { environment } from 'src/environments/environment';
export interface Profile {
    recruitApplicant: RecruitApplicantModel
    prefix: PrefixModel,
    maritalStatus: { id: string, value: string, tdesc: string, edesc: string },
    jobcode: JobcodeModel,
    oldJobcode: JobcodeModel,
    gender: { id: string, tdesc: string, edesc: string },
    nationality: NationalityModel,
    national: NationalModel,
    religion: ReligionModel,
    degree: DegreeModel[],
    militaryStatus: { id: string, tdesc: string, edesc: string },
    institue: InstitueModel[],
    faculty: FacultyModel[],
    major: MajorModel[],
    honors: { id: string, tdesc: string, edesc: string }[],
    jobZipcode: ZipcodeModel[],
    skillDegree: DegreeModel[],
    familyRelation: FamilyralationModel[],
    langSkill: { list: LangSkillModel[], load: boolean },
    occupation: OccupationModel[],
    familyStatus: { id: string, tdesc: string, edesc: string }[],
    branch: BranchModel,
    sourceJob: SourcejobModel,
    paperList: PaperListModel[],
}
@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, NgbPaginationModule, FormsModule, NgbModule],
    selector: 'app-modal-employee',
    templateUrl: './modal-employee.component.html',
    styleUrls: ['./modal-employee.component.scss']
})
export class ModalEmployeeComponent implements OnInit {
    url = environment.jbossUrl ;
    activeKeep = 1;
    profile: RecruitApplicantModel | undefined

    @Input() data: { profile: Profile | undefined } = { profile: undefined }


    constructor(public translateService: TranslateService,
        public ngbModal: NgbModal) {

    }
    ngOnInit(): void {

        this.profile = this.data.profile!.recruitApplicant;

        // console.log(this.profile)
        // console.log(this.data)
    }

    getDateFormat(date: string) {

        return new Date(date);
    }
    getDesc(tdesc: string, edesc: string): string {
        return this.translateService.currentLang == 'th' ? tdesc : edesc
    }
   


}
