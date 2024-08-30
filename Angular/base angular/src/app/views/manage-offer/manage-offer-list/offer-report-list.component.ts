import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { ExportFileType } from '../../../utils/common';
import { BaseComponent } from '../../../_components/base.component';
import { ManageOfferService } from '../../../_services/manage-offer.service';

@Component({
  selector: 'app-offer-report-list',
  template: `
    <div class="modal-content">
      <div class="modal-header bg-primary">
        <h5 class="modal-title">
          <i class="fa fa-user modal-icon"></i>
          {{ 'USERS_LIST' | translate }} [ {{ offerName }} ]
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
            <div class="col-md-4">
              <div class="form-group pull-right">
                <button (click)="downloadData('excel')" title="{{ 'EXPORT_TO_EXCEL' | translate }}" class="btn btn-success mr-10">
                  <i class="fa fa-file-excel-o fa-lg"></i>
                </button>
                <button (click)="downloadData('pdf')" title="{{ 'EXPORT_TO_PDF' | translate }}" class="btn btn-success mr-10">
                  <i class="fa fa-file-pdf-o fa-lg"></i>
                </button>
                <button (click)="downloadData('csv')" title="{{ 'EXPORT_TO_CSV' | translate }}" class="btn btn-success">
                  <i class="fa fa-file-text-o fa-lg"></i>
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
        <div class="wrap-datatable pos-rel">
          <div *ngIf="loadingIndicator" class="processing">{{ 'PROCESSING' | translate }}</div>
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
            <ngx-datatable-column name="{{ 'USE_DATE' | translate }}" [maxWidth]="150" prop="used_at" [sortable]="false">
              <ng-template let-value="value" ngx-datatable-cell-template>
                {{ value | customDate: momentDateFormat }}
              </ng-template>
            </ngx-datatable-column>
            <ngx-datatable-column name="{{ 'IP_ADDRESS' | translate }}" prop="ip_address" [sortable]="false"> </ngx-datatable-column>
          </ngx-datatable>
        </div>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class OfferReportListComponent extends BaseComponent implements OnInit {
  offerUuid = '';
  offerId = '';
  offerName = '';
  userList: any[] = [];
  sortParam = '';
  sortOrder = '';
  // Get datatble configuration -- end

  name = '';
  constructor(private offerService: ManageOfferService, public modalRef: BsModalRef, private http: HttpClient) {
    super();
  }
  ngOnInit() {
    this.getUserReportList();
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
    this.getUserReportList();
  }
  getUserReportList() {
    this.loadingIndicator = true;
    this.offerService
      .getOfferReportListURL(this.offerUuid, {
        username: this.name,
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
  /**
   * Offer Data Download
   * @param type
   */
  downloadData(type) {
    this.loader.showLoader();
    const exportData = {
      offerId: this.offerId,
      username: this.name,
      sort_param: this.sortParam,
      sort_type: this.sortOrder,
    };
    this.offerService.getExportUserList(exportData, type).subscribe(
      (data) => {
        this.downloadSuccessHandler(this.http, this.toastr, this.translateService, data, () => {
          this.loader.hideLoader();
        }, ExportFileType.OFFER);
      },
      (error) => {
        this.errorHandler(this.toastr, this.translateService, error, () => {
          this.loader.hideLoader();
        });
      },
      () => this.logger.log('OK')
    );
  }
}
