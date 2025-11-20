import { TranslateService } from "@ngx-translate/core";
import { BaseModel } from "./base.model";
import { Course } from "./course.model";

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
     this.course = data.course ? new Course(data.course, this.translateService) : undefined;

    // this.training.course = new MyCourse(this.training.course , this.translateService);


  }



  }
