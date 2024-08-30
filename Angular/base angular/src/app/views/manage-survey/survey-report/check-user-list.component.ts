import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { SurveyService } from '../../../_services/survey.service';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-multi-user-list',
  template: `
    <div class="modal-content">
      <div class="modal-header bg-primary">
        <h5 class="modal-title">
          <i class="fa fa-user modal-icon"></i>
          {{ 'USERS_LIST' | translate }} [ {{ question }} ] Option : {{ option }}
        </h5>
        <button type="button" class="close" (click)="decline()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form (ngSubmit)="searchApply()" novalidate #searchFrm="ngForm">
          <div class="row">
            <div class="col-md-4 col-12">
              <div class="form-group">
                <input [(ngModel)]="name" type="text" name="name" class="form-control" placeholder="{{ 'USERNAME' | translate }}" />
              </div>
            </div>
            <div class="col-md-4">
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
          <div class="col-md-12">
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
          >
            <ngx-datatable-column name="{{ 'USERNAME' | translate }}" prop="username" [sortable]="false"> </ngx-datatable-column>
            <ngx-datatable-column name="{{ 'EMAIL' | translate }}" prop="email" [sortable]="false"> </ngx-datatable-column>
          </ngx-datatable>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-warning" (click)="decline()">
          {{ 'CLOSE' | translate }}
        </button>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class CheckUserListComponent implements OnInit {
  ansUuid: any;
  question: string;
  option: string;
  userList: any[] = [];
  // Get datatble configuration -- start
  private loadingIndicator = false;
  reorderable = CONFIGCONSTANTS.datatableConfig.reorderable;
  scrollbarH = CONFIGCONSTANTS.datatableConfig.scrollbarH;
  serverSorting = CONFIGCONSTANTS.datatableConfig.serverSorting;
  serverPaging = CONFIGCONSTANTS.datatableConfig.serverPaging;
  piningRight = CONFIGCONSTANTS.datatableConfig.piningRight;
  headerHeight = CONFIGCONSTANTS.datatableConfig.headerHeight;
  footerHeight = CONFIGCONSTANTS.datatableConfig.footerHeight;
  rowHeight = CONFIGCONSTANTS.datatableConfig.rowHeight;
  limitList: any[] = CONFIGCONSTANTS.datatableConfig.limitList;
  ColumnMode = ColumnMode;
  totalReords = CONFIGCONSTANTS.datatableConfig.page.totalReords;
  pageNumber = CONFIGCONSTANTS.datatableConfig.page.pageNumber;
  size = CONFIGCONSTANTS.datatableConfig.page.size;
  dtMessages = CONFIGCONSTANTS.datatableConfig.dtMessages;
  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  sortParam = '';
  sortOrder = '';
  // Get datatble configuration -- end

  name = '';
  constructor(private surveyService: SurveyService, public modalRef: BsModalRef, private modalService: BsModalService) {}
  ngOnInit() {
    this.getAnswerForCheckType();
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
    this.getAnswerForCheckType();
  }
  getAnswerForCheckType() {
    this.loadingIndicator = true;
    this.surveyService
      .getAnswerForSingleMultipleType({
        answer_uuid: this.ansUuid,
        name: this.name,
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
}
