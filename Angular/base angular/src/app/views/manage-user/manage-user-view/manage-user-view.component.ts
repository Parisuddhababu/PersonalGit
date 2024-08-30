import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { DownloadPdfService } from './../../../_services/download-pdf.service';
import { ManageuserService } from './../../../_services/manageuser-service';

@Component({
  selector: 'app-manage-user-view',
  templateUrl: './manage-user-view.component.html',
  styleUrls: ['./manage-user-view.component.scss'],
})
export class ManageUserViewComponent extends BaseComponent implements OnInit {
  model: any = {};
  url = this.noProfileImage;
  private _id: number;
  editMode = false;
  private editUserId: number;
  submitted = false;
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, private manageuserservice: ManageuserService, public downloadPdfService: DownloadPdfService) {
    super();
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this._id = params['id'];
      this.editMode = params['id'] !== undefined;
      setTimeout(() => {
        this.initForm();
      }, 1000);
    });
  }
  /**
   * Selected input value in edit mode
   */
  initForm() {
    if (this.editMode) {
      this.manageuserservice
        .getManagerUserById(this._id)
        .pipe(first())
        .subscribe((response) => {
          this.editUserId = response.data.id || null;
          this.model.fullname = response.data.first_name + ' ' + response.data.last_name || '';
          this.model.username = response.data.username || '';
          this.model.email = response.data.email || '';
          this.model.mobileNumber = response.data.phone_number || '';
          this.model.dob = response.data.date_of_birth || '';
          this.model.gender = response.data.gender || '';
          this.model.status = response.data.status || '';

          if (response.data.profile_image) {
            this.url = response.data.profile_photo;
            this.model.profile_photo = response.data.profile_image;
          } else {
            this.url = this.noProfileImage;
            this.model.profile_photo = null;
          }
        });
    }
  }
  printPdf(ref) {
    this.loader.showLoader();
    this.downloadPdfService.downloadReadOnlyPdf(ref, `${this._id}.pdf`, true, () => {
      this.loader.hideLoader();
    });
  }
}
