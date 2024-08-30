import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { ViewImageModalComponent } from '../../../_modal/view-image.component';

@Component({
  selector: 'app-bs-media-list-details',
  template: `
    <div class="col-md-12 view-user" *ngIf="selectedItems == ''">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <label class="col-md-12 text-center"><i class="fa fa-eye-slash fa-5x img-responsive" aria-hidden="true"></i> </label>
          </div>
          <div c1lass="row">
            <div class="col-md-12 text-center form-group">{{ 'NOTHING_IS_SELECTED' | translate }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 view-user" *ngIf="selectedItems != '' && selectedItemsDetails">
      <div class="row">
        <div class="col-md-12" *ngIf="selectedItemsDetails.type != 'folder' && fileTypesCheck('imageTypesCompare')">
          <div class="row">
            <div [hidden]="!imageLoader" class="processing">{{ 'PROCESSING' | translate }}</div>
            <label class="col-md-12"
              ><img
                src="{{ selectedItemsDetails.media_url }}"
                alt="{{ selectedItemsDetails.name }}"
                class="img-responsive col-md-12"
                max-height="250px"
                (click)="openModalForImage(selectedItemsDetails.media_url)"
                (load)="this.imageLoader = false"
                [hidden]="imageLoader"
              />
            </label>
          </div>
        </div>
        <div class="col-md-12" *ngIf="selectedItemsDetails.type != 'folder' && fileTypesCheck('videoTypesCompare')">
          <div class="row">
            <label class="col-md-12">
              <video #videoPlayer id="mainVideo" controls crossorigin="anonymous" class="upload-area col-md-12">
                <source [src]="selectedItemsDetails.media_url" />
                Your browser does not support video.
              </video>
              <canvas id="video-canvas" style="display:none" #canvasEle></canvas>
            </label>
          </div>
        </div>
        <div class="col-md-12" *ngIf="selectedItemsDetails.type != 'folder' && fileTypesCheck('audioTypesCompare')">
          <div class="row">
            <label class="col-md-12">
              <audio #audioPlayer id="mainAudio" controls crossorigin="anonymous" class="upload-area col-md-12">
                <source [src]="selectedItemsDetails.media_url" />
                Your browser does not support audio.
              </audio>
              <canvas id="audio-canvas" style="display:none" #canvasEle></canvas>
            </label>
          </div>
        </div>
        <div class="col-md-12">
          <div class="row">
            <label class="col-md-4">{{ 'TITLE' | translate }} </label>
            <div class="col-md-8">
              {{ selectedItemsDetails.name }}
            </div>
          </div>
        </div>
        <div class="col-md-12" *ngIf="selectedItemsDetails.type != 'folder'">
          <div class="row">
            <label class="col-md-4">{{ 'SIZE' | translate }} </label>
            <div class="col-md-8">
              {{ selectedItemsDetails.size == null ? '00 kb' : convertBytesToKb(selectedItemsDetails.size) }}
            </div>
          </div>
        </div>
        <div class="col-md-12" *ngIf="selectedItemsDetails.type != 'folder'">
          <div class="row">
            <label class="col-md-4">{{ 'URL' | translate }} </label>
            <div class="col-md-8">
              <a href="{{ selectedItemsDetails.media_url }}" target="_blank">Click here</a>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="row">
            <label class="col-md-4">{{ 'CREATED_AT' | translate }} </label>
            <div class="col-md-8">
              {{ selectedItemsDetails.created_at != null ? convertDateTime(selectedItemsDetails.created_at) : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./bs-media-list.component.scss'],
})
export class BsMediaListDetailsComponent implements OnInit {
  @Input() selectedItems;
  @Input() selectedItemsDetails;
  private modalRef: BsModalRef;
  momentDateTime24Format: string;
  audioTypes = 'audio';
  imageTypes = 'image';
  videoTypes = 'video';
  videoTypesCompare = false;
  audioTypesCompare = false;
  imageTypesCompare = false;
  imageLoader = true;

  constructor(private modalService: BsModalService) {}
  ngOnInit() {
    this.momentDateTime24Format = CONFIGCONSTANTS.momentDateTime24Format || 'MM/DD/YYYY hh:mm:ss';
    // if(this.selectedItemsDetails){
    //   this.fileTypesCheck();
    // }
  }

  convertDateTime(date) {
    return moment(date).format(this.momentDateTime24Format);
  }

  fileTypesCheck(data) {
    if (data === 'imageTypesCompare') {
      return this.selectedItemsDetails.mimetype.includes(this.imageTypes) === true ? true : false;
    }
    if (data === 'videoTypesCompare') {
      return this.selectedItemsDetails.mimetype.includes(this.videoTypes) === true ? true : false;
    }
    if (data === 'audioTypesCompare') {
      return this.selectedItemsDetails.mimetype.includes(this.audioTypes) === true ? true : false;
    }
  }

  /* Open Model For Image Show */
  openModalForImage(img) {
    const initialState = {
      image: img,
    };
    this.modalRef = this.modalService.show(ViewImageModalComponent, {
      class: 'modal-lg',
      initialState,
    });
  }

  /* Bytes to KB convert*/
  convertBytesToKb(bytes) {
    if (bytes === 0) {
      return '0 Kb';
    }
    const decimals = 2;
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = 'KB';

    const kbSize = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, kbSize)).toFixed(dm)) + ' ' + sizes;
  }
}
