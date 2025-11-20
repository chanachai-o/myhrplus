import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalEmployeeComponentPassComponent } from 'src/app/component/shared-ui/modal-employee-component-pass/modal-employee-component-pass.component';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDatepickerModule],
  selector: 'app-rec-candidate',
  templateUrl: './rec-candidate.component.html',
  styleUrls: ['./rec-candidate.component.scss']
})
export class RecCandidateComponent implements OnInit {

    constructor(
        private modalService: NgbModal
      ) {

      }

  ngOnInit(): void {
  }
  openModal(){
    this.modalService.open(ModalEmployeeComponentPassComponent, {size: 'xl'})
  }

}
