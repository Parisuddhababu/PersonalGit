import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BaseComponent } from '../../../_components/base.component';
import { DescriptionModalComponent } from '../../../_modal/description.component';
import { SuggestionService } from '../../../_services/suggestion.service';

@Component({
  selector: 'app-user-suggestion-list',
  templateUrl: './user-suggestion-list.component.html',
  styleUrls: ['./user-suggestion-list.component.scss'],
})
export class UserSuggestionListComponent extends BaseComponent implements OnInit {
  suggestionList = [];
  global_search = '';
  private filteredData = [];
  // Get datatble configuration -- end

  constructor(private suggestionService: SuggestionService) {
    super();
  }

  ngOnInit() {
    this.getAllSuggestionList();
  }
  /**
   * Show number of records in datatable
   * @param value show total entries value 10,25,50,100
   */
  public changeLimit(value) {
    this.size = value;
  }
  /**
   * Get Suggestion list data
   */
  private getAllSuggestionList(): void {
    this.suggestionService
      .getUserSuggestionList()
      .pipe(first())
      .subscribe((data) => {
        if (!data.data) {
          this.suggestionList = [];
        } else {
          this.suggestionList = data.data;
          this.filteredData = data.data;
        }
      });
  }

  /**
   * Datatabe global search
   * @param event get search input value
   */
  public filterDatatable(event) {
    const val = event.target.value.toLowerCase();
    // get the key names of each column in the dataset
    const keys = ['category_name', 'information'];
    // assign filtered matches to the active datatable
    this.suggestionList = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < keys.length; i++) {
        // check for a match
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.datatable.offset = 0;
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
