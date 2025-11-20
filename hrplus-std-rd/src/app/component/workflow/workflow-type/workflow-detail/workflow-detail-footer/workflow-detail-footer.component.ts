import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ManageDocument, RoutingHistory } from 'src/app/models/workflow.model';
import { workflowService } from 'src/app/services/workflow.service';
declare var require: any
const FileSaver = require('file-saver');
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-workflow-detail-footer',
  templateUrl: './workflow-detail-footer.component.html',
  styleUrls: ['./workflow-detail-footer.component.scss']
})
export class WorkflowDetailFooterComponent implements OnInit {
  @Input() workflowData: any
  @Input() manageDocument?: ManageDocument
  routingHistoryList: RoutingHistory[] = []
  routingHistoryComments: {
    fullName_tdesc: string,
    fullName_edesc: string,
    position_tdesc: string,
    position_edesc: string,
    completionTime: string,
    comments: string
  }[] = []
  constructor(private wfService: workflowService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    if (this.manageDocument?.routingHistory) {
      this.routingHistoryList = []
      this.routingHistoryList = this.manageDocument.routingHistory
      this.routingHistoryComments = []
      this.routingHistoryComments = this.manageDocument.routingHistory.filter(x => x.comments).map(x => {
        return {
          fullName_tdesc: x.fullName_tdesc ? x.fullName_tdesc : "",
          fullName_edesc: x.fullName_edesc ? x.fullName_edesc : "",
          position_tdesc: x.position_tdesc ? x.position_tdesc : "",
          position_edesc: x.position_edesc ? x.position_edesc : "",
          completionTime: x.completionTime ? x.completionTime : "",
          comments: x.comments ? x.comments : ""
        }
      })
    }
  }

  dowloadFile() {
    if (this.manageDocument) {
      if(this.manageDocument.attachFile?.length > 1){
        let findFile = this.manageDocument?.attachFile?.find((x:any) => x.name == this.workflowData.screen_value.nameFileUpload)
        this.wfService.downloadFile(findFile.subFolder, findFile.name).then(result => {
          const myBlob = new Blob([result ? result : ""]);
          FileSaver.saveAs(myBlob, findFile.name);
        })
    }else{
      this.wfService.downloadFile(this.manageDocument.attachFile[0].subFolder, this.manageDocument.attachFile[0].name).then(result => {
        const myBlob = new Blob([result ? result : ""]);
        FileSaver.saveAs(myBlob, this.manageDocument?.attachFile[0].name);
      })
    }
    }
  }
 checkmultiFile(){
  if(this.manageDocument){
    if(this.manageDocument.attachFile?.length > 1){
      let findFile = this.manageDocument?.attachFile?.find((x:any) => x.name == this.workflowData.screen_value.nameFileUpload)
      return findFile?findFile.name:''
  }else{
      return this.manageDocument.attachFile[0].name
  }
  }
 }
  getMessageTranslate(th?: string, eng?: string) {
    return this.translateService.currentLang == 'th' ? (th ? th : (eng ? eng : '')) : (eng ? eng : (th ? th : ''))
  }

}
