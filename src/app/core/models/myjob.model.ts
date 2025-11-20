import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { environment } from "src/environments/environment";

export interface MyjobProfileModel {
  employeeId: string;
  profile: ProfileJobModel;
  jobPost: JobPostModel;
}

export interface JobPostModel {
  companyId: string;
  jobPostId: string;
  announcementId: string;
  status: number;
  jobTitle: string;
}

export interface ProfileJobModel {
  profileId: string;
  picture: string;
  thFirstname: string;
  engFirstname: string;
  thLastname: string;
  engLastname: string;
  birthday: string;
  sex: number;
  email: string;
}

export class MyjobProfileModel extends BaseModel implements MyjobProfileModel {
  employeeId: string;
  profile: ProfileJobModel;
  jobPost: JobPostModel;
  constructor(data?: Partial<MyjobProfileModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.employeeId = data?.employeeId!
    this.profile = data?.profile ? new ProfileJobModel(data.profile, translateService) : data?.profile!
    this.jobPost = data?.jobPost!
  }
}


export class ProfileJobModel extends BaseModel implements ProfileJobModel {
  profileId: string;
  picture: string;
  thFirstname: string;
  engFirstname: string;
  thLastname: string;
  engLastname: string;
  birthday: string;
  sex: number;
  email: string;
  constructor(data?: Partial<ProfileJobModel>, translateService?: TranslateService) {
    super(data, translateService)
    this.profileId = data?.profileId!
    this.picture = data?.picture!
    this.thFirstname = data?.thFirstname!
    this.thLastname = data?.thLastname!
    this.engFirstname = data?.engFirstname!
    this.engLastname = data?.engLastname!
    this.sex = data?.sex!
    this.birthday = data?.birthday!
    this.email = data?.email!
  }

  getFullname(): string {
    return this.translateService.currentLang == 'th' ? this.thFirstname + " " + this.thLastname : this.engFirstname + " " + this.engLastname
  }

  getPicture() {
    return this.picture ? (environment.myjobUrl + "/api/files/image/" + this.picture) : "assets/img/author.jpg"
  }

}
