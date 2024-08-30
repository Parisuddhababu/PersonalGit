import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-description-modal',
  template: `
    <div class="modal-content custom-modal">
      <div class="modal-header bg-primary">
        <h5 class="modal-title"><i class="fa fa-comments modal-icon"></i> {{ modalTitle | translate }}</h5>
        <button type="button" class="close" (click)="modelDecline()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body overflow">
        <div [innerHtml]="description"></div>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class DescriptionModalComponent implements OnInit {
  onOk: any;
  modalTitle: string;
  description: string;

  constructor(public modalRef: BsModalRef) {}
  ngOnInit() {}
  modelDecline(): void {
    this.modalRef.hide();
  }
}
