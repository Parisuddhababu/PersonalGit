import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { ExportFileType } from '../../../utils/common';
import { BaseComponent } from '../../../_components/base.component';
import { DescriptionModalComponent } from '../../../_modal/description.component';
import { SuggestionService } from '../../../_services/suggestion.service';

@Component({
  selector: 'app-admin-suggestion-list',
  templateUrl: './admin-suggestion-list.component.html',
  styleUrls: ['./admin-suggestion-list.component.scss'],
})
export class AdminSuggestionListComponent extends BaseComponent implements OnInit {
  suggestionList = [];
  // filter
  filter = this.defaultFilterData;
  categoryList = [];
  private sugID: number;
  private notes: string;
  private changedStatus: string;
  constructor(private suggestionService: SuggestionService,
    private http: HttpClient) {
    super();
  }

  ngOnInit() {
    this.filter = this.filterService.getState('adSuggFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('adSuggSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('adSuggSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('adSuggPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('adSuggSize', this.size);
    this.getActiveCategoryList();
    this.getAllSuggestionList();
  }
  private getActiveCategoryList(): void {
    this.suggestionService
      .getActiveCategoryList(CONFIGCONSTANTS.suggestionId)
      .pipe(first())
      .subscribe((data) => {
        if (!data.data) {
          this.categoryList = [];
        } else {
          this.categoryList = data.data;
        }
      });
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
  private get filterData() {
    return {
      category_name: this.filter.category_name,
      suggestion: this.filter.suggestion,
      posted_name: this.filter.posted_name,
      status: this.filter.status,
      sort_param: this.sortParam,
      sort_type: this.sortOrder,
    };
  }
  /**
   * Get Suggestion list data
   */
  private getAllSuggestionList(): void {
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('adSuggFilter', this.filter);
    this.filterService.saveSingleState('adSuggSortParam', this.sortParam);
    this.filterService.saveSingleState('adSuggSortOrder', this.sortOrder);
    this.filterService.saveSingleState('adSuggPageNo', this.pageNumber);
    this.filterService.saveSingleState('adSuggSize', this.size);
    this.loadingIndicator = true;
    this.suggestionService
      .getAdminSuggestionList({
        ...this.filterData,
        start: this.pageNumber * this.size,
        length: this.size,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.suggestionList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (error) => {
          this.loadingIndicator = false;
        }
      );
  }

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id, status, notes) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.sugID = id;
    this.changedStatus = status === 'Pending' ? '' : status;
    this.notes = notes ? notes : '';
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change Suggestion status
   */
  public changeStatus(frm: NgForm) {
    if (frm.invalid) {
      return;
    }
    this.loader.showLoader();
    this.suggestionService
      .changeSuggestionStatus(this.changedStatus, this.notes, this.sugID)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender(false);
          }
        },
        (error) => {
          this.errorHandler(this.toastr, this.translateService, error, () => {
            this.loader.hideLoader();
          });
        }
      );
  }
  /**
   * Delete Suggestion
   */
  public deleteSuggestion() {
    this.loader.showLoader();
    this.suggestionService
      .deleteSuggestion(this.sugID)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loader.hideLoader();
          if (data.meta.status === true) {
            this.modalRef.hide();
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
  get defaultFilterData() {
    return {
      category_name: '',
      suggestion: '',
      posted_name: '',
      status: '',
    };
  }
  public searchApply() {
    this.rerender(true);
  }

  public resetSearch() {
    this.filter = this.defaultFilterData;
    this.rerender(true);
  }
  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  private rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.suggestionList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getAllSuggestionList();
  }
  downloadData(type) {
    this.loader.showLoader();
    this.suggestionService.getExportSuggestionList(this.filterData, type).subscribe(
      (data) => {
        this.downloadSuccessHandler(this.http, this.toastr, this.translateService, data, () => {
          this.loader.hideLoader();
        }, ExportFileType.SUGGESTION);
      },
      (error) => {
        this.errorHandler(this.toastr, this.translateService, error, () => {
          this.loader.hideLoader();
        });
      },
      () => this.logger.log('OK')
    );
  }
  openDescriptionModal(msg) {
    const initialState = {
      modalTitle: 'INFORMATION',
      description: msg,
    };
    this.modalRef = this.modalService.show(DescriptionModalComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState,
    });
  }
}
