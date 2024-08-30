import { Component, OnInit, TemplateRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { DescriptionModalComponent } from '../../../_modal/description.component';
import { RulesetService } from '../../../_services/ruleset.service';

@Component({
  selector: 'app-ruleset-list',
  templateUrl: './ruleset-list.component.html',
  styleUrls: ['./ruleset-list.component.scss'],
})
export class RulesetListComponent extends BaseComponent implements OnInit {
  ruleList = [];

  filter = this.defaultFilterData;
  private ruleId: number;
  private changeStatusType: string;
  private changedStatus: string;
  loadingIndicator = false;
  constructor(private rulesetService: RulesetService) {
    super();
    // For get filter, sorting, pagenumber and size in storage
    this.filter = this.filterService.getState('rulsetFilter', this.filter);
    this.sortParam = this.filterService.getSingleState('rulsetSortParam', this.sortParam);
    this.sortOrder = this.filterService.getSingleState('rulsetSortOrder', this.sortOrder);
    this.pageNumber = this.filterService.getSingleState('rulsetPageNo', this.pageNumber);
    this.size = this.filterService.getSingleState('rulsetSize', this.size);
  }

  ngOnInit() {
    this.getRulesetList();
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
  /**
   * Get Sub Admin list data
   */
  private getRulesetList() {
    this.loadingIndicator = true;
    // For save filter, sorting, pagenumber and size in storage
    this.filterService.saveState('rulsetFilter', this.filter);
    this.filterService.saveSingleState('rulsetSortParam', this.sortParam);
    this.filterService.saveSingleState('rulsetSortOrder', this.sortOrder);
    this.filterService.saveSingleState('rulsetPageNo', this.pageNumber);
    this.filterService.saveSingleState('rulsetSize', this.size);
    this.rulesetService
      .getRulesetList({
        name: this.filter.name,
        active: this.filter.active,
        start: this.pageNumber * this.size,
        length: this.size,
        sort_param: this.sortParam,
        sort_type: this.sortOrder,
      })
      .pipe(first())
      .subscribe(
        (resp) => {
          this.loadingIndicator = false;
          this.ruleList = resp.data['original'].data;
          this.totalReords = resp.data['original'].recordsTotal;
        },
        (err) => {
          this.loadingIndicator = false;
        }
      );
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.ruleId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }
  /**
   * Change Sub Admin status Active or Inactive
   */
  public changeStatus() {
    this.loader.showLoader();
    this.changedStatus = this.changeStatusType + '' === '1' ? '0' : '1';
    this.rulesetService
      .changeRulesetStatus({ status: this.changedStatus, id: this.ruleId })
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
   * Delete Rule set
   */
  public deleteRuleset() {
    this.loader.showLoader();
    this.rulesetService
      .deleteRuleset({ id: this.ruleId })
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

  public searchApply() {
    this.rerender(true);
  }
  get defaultFilterData() {
    return {
      name: '',
      active: '',
    };
  }
  public resetSearch() {
    this.datatable.headerComponent.offsetX = 0;
    this.filter = this.defaultFilterData;
    this.rerender(true);
  }
  /**
   * API call and refresh datatable value
   * @param goFirstPage set first page when param value true
   */
  rerender(goFirstPage, isDelete = false): void {
    if (goFirstPage) {
      this.pageNumber = 0;
    }
    // Pagination is lost and the panel moves back to the 1st page instead of staying on the same page when delete record
    if (isDelete && this.pageNumber && this.ruleList.length === 1) {
      this.pageNumber = this.pageNumber - 1;
    }
    this.getRulesetList();
  }
  openDescriptionModal(msg) {
    const initialState = {
      modalTitle: 'DESCRIPTION',
      description: msg,
    };
    this.modalRef = this.modalService.show(DescriptionModalComponent, {
      class: 'modal-lg',
      backdrop: 'static',
      initialState,
    });
  }
}
