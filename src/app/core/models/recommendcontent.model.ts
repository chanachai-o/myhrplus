import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Course, MyCourse } from "./course.model";

export interface RecommendContent {
  course?: Course ;
  status?: string;
  dateRequest?: string;
  reCurrentStartdate?: string;
}

  export class MyRecommendContent extends BaseModel implements RecommendContent{
    //---TrainingHistoryModel
    course : Course | undefined;




  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
     this.course = new MyCourse(this.course! , this.translateService);

    // this.training.course = new MyCourse(this.training.course , this.translateService);


  }



  }
