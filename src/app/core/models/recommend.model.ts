import { MyRecommendContent, RecommendContent } from './recommendcontent.model';
import { Sort2 } from './sort2.model';
import { PageAble } from './pageable.model';
import { BaseModel } from './base.model';
import { TranslateService } from '@ngx-translate/core';
  export interface RecommendModel {
      content: RecommendContent[] | undefined;
      pageable?: PageAble;
      last?: boolean;
      totalPages?: number;
      totalElements?: number;
      number?: number;
      sort?: Sort2;
      size?: number;
      numberOfElements?: number;
      first?: boolean;
      empty?: boolean;
  }

  export class MyRecommendModel extends BaseModel implements RecommendModel{
    content : RecommendContent[] | undefined;




  constructor(data: Partial<any>, translateService: TranslateService) {
    super(data, translateService);
     this.content = this.content!.map(dataContent => new MyRecommendContent(dataContent , translateService));


  }



  }


