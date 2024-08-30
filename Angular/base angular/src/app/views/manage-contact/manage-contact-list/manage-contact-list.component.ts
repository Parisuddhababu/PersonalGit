import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { DescriptionModalComponent } from '../../../_modal/description.component';
import { ManagecontactService } from '../../../_services/managecontact.service';

@Component({
  selector: 'app-manage-contact-list',
  templateUrl: './manage-contact-list.component.html',
  styleUrls: ['./manage-contact-list.component.scss'],
})
export class ManageContactListComponent extends BaseComponent implements OnInit {
  contactList: any[] = [];
  private changeStatusType: string;
  private userID: number;

  filter = this.defaultFilterData;

  subject = '';
  message = '';
  selectStatus = 'Pending';
  submitted = false;
  constructor(private contactService: ManagecontactService) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('enquiryFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('enquirySortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('enquirySortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('enquiryPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('enquirySize', this.size);
    this.getAllManageContactList();
  }

  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.rerender(false);
  }

  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.rerender(false);
  }

  public changeLimit(value) {
    this.size = value;
    this.rerender(true);
  }

  private getAllManageContactList(): void {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('enquiryFilter', this.filter);
    this.filterService.saveSingleState('enquirySortParam', this.sortParam);
    this.filterService.saveSingleState('enquirySortOrder', this.sortOrder);
    this.filterService.saveSingleState('enquiryPageNo', this.pageNumber);
    this.filterService.saveSingleState('enquirySize', this.size);
    this.loadingIndicator = true;
    this.contactService
      .getAllContactList({
        name: this.filter.name,
        contact_details: this.filter.contact_details,
        subject: this.subject,
        message: this.message,
        status: this.filter.status,
        start: this.pageNumber * this.size,
        length: this.size,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.contactList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (error) => {
          this.loadingIndicator = false;
        }
      );
  }

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.userID = id;
    this.selectStatus = status === 'Pending' ? '' : status;
  }

  decline(): void {
    this.modalRef.hide();
  }

  public deleteManageUser() {
    this.loader.showLoader();
    this.contactService
      .deleteContact(this.userID)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.loader.hideLoader();
            this.toastr.success(data.meta.message);
            this.rerender(false, true);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }

  public searchApply() {
    this.rerender(true);
  }
  get defaultFilterData() {
    return {
      name: '',
      contact_details: '',
      status: '',
    };
  }
  public resetSearch() {
    this.filter = this.defaultFilterData;
    this.subject = '';
    this.message = '';
    this.rerender(true);
  }

  private rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.contactList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllManageContactList();
  }

  /**
   * Change contact status
   */
  public changeStatus(changeStatusFrm: NgForm) {
    this.submitted = true;
    if (changeStatusFrm.invalid) {
      return;
    }

    const formData = {
      id: this.userID,
      status: this.selectStatus,
    };
    this.loader.showLoader();
    this.contactService
      .changeStatus(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender(true);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  openDescriptionModal(msg) {
    const initialState = {
      modalTitle: 'MESSAGE',
      description: msg,
    };
    this.modalRef = this.modalService.show(DescriptionModalComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState,
    });
  }
}
