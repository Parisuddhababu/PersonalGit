import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-view-image-modal',
  template: `
    <div class="modal-content custom-modal">
      <div class="modal-header bg-primary">
        <h5 class="modal-title"><i class="fa fa-picture-o modal-icon"></i> {{ 'VIEW_IMAGE' | translate }}</h5>
        <button type="button" class="close" (click)="modelDecline()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row" style="max-height:400px;overflow-y:auto">
          <div class="col-12 image-wrapper">
            <img [src]="image" (error)="getDefaultImg($event)" />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" (click)="modelDecline()">{{ 'CLOSE' | translate }}</button>
      </div>
    </div>
  `,
  styles: [
    `
      .image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .image-wrapper img {
        max-width: 100%;
      }
    `,
  ],
})
export class ViewImageModalComponent implements OnInit {
  public noImage = 'assets/no-image.png';
  image: string;
  constructor(public modalRef: BsModalRef) {}
  ngOnInit() {}
  getDefaultImg(event) {
    event.target.src = this.noImage;
  }
  modelDecline(): void {
    this.modalRef.hide();
  }
}
