import { Component, OnInit, TemplateRef } from '@angular/core';
import { SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { SurveyService } from '../../../_services/survey.service';

@Component({
  selector: 'app-survey-user-report',
  template: `
    <div class="modal-content">
      <div class="modal-header bg-primary">
        <h5 class="modal-title">
          <i class="fa fa-user modal-icon"></i>
          {{ 'USER_REPORT' | translate }}
        </h5>
        <button type="button" class="close" (click)="decline()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body overflow">
        <form (ngSubmit)="searchApply()" novalidate #searchFrm="ngForm">
          <div class="row">
            <div class="col-md-4 col-12">
              <div class="form-group">
                <input [(ngModel)]="name" type="text" name="name" class="form-control" placeholder="{{ 'USERNAME' | translate }}" />
              </div>
            </div>
            <div class="col-md-4 col-12">
              <div class="form-group">
                <input [(ngModel)]="email" type="text" name="email" class="form-control" placeholder="{{ 'EMAIL' | translate }}" />
              </div>
            </div>
            <div class="col-md-4 col-12">
              <div class="form-group">
                <select class="form-control" [(ngModel)]="has_submitted" name="has_submitted">
                  <option value="">{{ 'HAS_SUBMITTED' | translate }}</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group pull-right">
                <button type="submit" class="btn btn-primary mr-10"><i class="fa fa-search"></i> {{ 'SEARCH' | translate }}</button>
                <button type="button" class="btn btn-warning" (click)="resetSearch()">
                  <i class="fa fa-refresh"></i> {{ 'RESET' | translate }}
                </button>
              </div>
            </div>
          </div>
        </form>
        <hr />
        <div class="row">
          <div class="col-md-6">
            <div class="form-group show-select">
              <label
                >{{ 'SHOW' | translate }}
                <select name="showRecords" [(ngModel)]="size" (change)="changeLimit(size)" class="form-control">
                  <option [value]="limit" *ngFor="let limit of limitList">{{ limit }}</option>
                </select>
                {{ 'ENTRIES' | translate }}
              </label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <button
                type="button"
                [disabled]="selected.length == 0"
                class="btn btn-success pull-right"
                (click)="openModal(templateNotify)"
              >
                <i class="fa fa-envelope-o"></i>
                {{ 'NOTIFY_USER' | translate }}
              </button>
            </div>
          </div>
        </div>
        <div class="wrap-datatable">
          <ngx-datatable
            [rows]="userList"
            class="material fullscreen"
            headerHeight="headerHeight"
            footerHeight="footerHeight"
            rowHeight="rowHeight"
            [reorderable]="reorderable"
            [columnMode]="ColumnMode.force"
            #datatable
            [scrollbarH]="scrollbarH"
            [externalSorting]="serverSorting"
            (sort)="onSort($event)"
            [sorts]="[{ prop: sortParam, dir: sortOrder }]"
            [externalPaging]="serverPaging"
            [count]="totalReords"
            [offset]="pageNumber"
            [limit]="size"
            (page)="setPage($event)"
            [messages]="dtMessages"
            [selected]="selected"
            [selectionType]="SelectionType.checkbox"
            [selectAllRowsOnPage]="false"
            [displayCheck]="displayCheck"
            (select)="onSelect($event)"
          >
            <ngx-datatable-column
              [width]="30"
              [sortable]="false"
              [canAutoResize]="false"
              [draggable]="false"
              [resizeable]="false"
              [headerCheckboxable]="true"
              [checkboxable]="true"
            >
            </ngx-datatable-column>
            <ngx-datatable-column name="{{ 'USERNAME' | translate }}" prop="name" [sortable]="false"> </ngx-datatable-column>
            <ngx-datatable-column name="{{ 'EMAIL' | translate }}" prop="email" [sortable]="false"> </ngx-datatable-column>
            <ngx-datatable-column name="{{ 'HAS_SUBMITTED' | translate }}" prop="has_submitted" [sortable]="false">
              <ng-template let-value="value" ngx-datatable-cell-template>
                <div class="text-center">
                  <span [ngClass]="getStatusClass(value)" class="badge">{{ value }}</span>
                </div>
              </ng-template>
            </ngx-datatable-column>
          </ngx-datatable>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-warning" (click)="decline()">
          {{ 'CLOSE' | translate }}
        </button>
      </div>
    </div>
    <ng-template #templateNotify>
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h5 class="modal-title"><i class="fa fa-info-circle modal-icon"></i> {{ 'CONFIRMATION' | translate }}</h5>
          <button type="button" class="close" (click)="declineNotify()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body text-center">
          {{ 'NOTIFY_CONFIRM' | translate }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" (click)="notifyUser()">Yes</button>
          <button type="button" class="btn btn-warning" (click)="declineNotify()">No</button>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: [],
})
export class SurveyUserReportComponent extends BaseComponent implements OnInit {
  modalRefNot: BsModalRef;
  surveyUuid: any;
  userList: any[] = [];
  limitList = [10, 25, 50, 100, 500];
  // size = CONFIGCONSTANTS.datatableConfig.page.size;
  size = 500; // for select(check) All issue resolve
  sortParam = '';
  sortOrder = '';

  name = '';
  email = '';
  has_submitted = '';
  selected = [];
  SelectionType = SelectionType;

  constructor(private surveyService: SurveyService, public modalRef: BsModalRef) {
    super();
  }
  ngOnInit() {
    this.getSurveyUserReport();
  }
  /**
   * Sort datatable fields
   * @param event event was triggered, start sort sequence
   */
  public onSort(event) {
    this.sortParam = event.sorts[0].prop;
    this.sortOrder = event.sorts[0].dir;
    this.rerender(false);
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  public setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.rerender(false);
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
    this.rerender(true);
  }
  public searchApply() {
    this.rerender(true);
  }

  public resetSearch() {
    this.name = '';
    this.email = '';
    this.has_submitted = '';
    this.rerender(true);
  }
  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  private rerender(goFirstPage): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    this.getSurveyUserReport();
  }
  getSurveyUserReport() {
    this.loadingIndicator = true;
    this.surveyService
      .getSurveyUserReport({
        survey_uuid: this.surveyUuid,
        name: this.name,
        email: this.email,
        has_submitted: this.has_submitted,
        start: this.pageNumber * this.size,
        length: this.size,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          const respData = resp.data['original'];
          this.userList = respData.data;
          this.totalReords = respData.recordsTotal;
        },
        (error) => {
          this.loadingIndicator = false;
        }
      );
  }
  decline(): void {
    this.modalRef.hide();
  }
  openModal(template: TemplateRef<any>) {
    this.modalRefNot = this.modalService.show(template, { class: 'modal-md' });
  }
  declineNotify(): void {
    this.modalRefNot.hide();
    this.selected = [];
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected.filter((ele) => ele.has_submitted === 'No'));
  }
  displayCheck(row) {
    // display checkbox only for submitted user
    return row.has_submitted === 'No';
  }
  notifyUser() {
    // send email to user
    this.loader.showLoader();
    this.surveyService
      .notifySurveyUserReport({
        survey_uuid: this.surveyUuid,
        users: this.selected.map((ele) => ele.user_id).toString(),
      })
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.declineNotify();
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
}
