import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  selector: 'app-auto-assign-work',
  templateUrl: './auto-assign-work.component.html',
  styleUrls: ['./auto-assign-work.component.scss']
})
export class AutoAssignWorkComponent implements OnInit {
    constructor(private modalService: NgbModal,) {
    }
    ngOnInit(): void {
    }
    openModal(content: string) {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }
}
