import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { BaseComponent } from '../../../_components/base.component';
import { SuggestionService } from '../../../_services/suggestion.service';
@Component({
  selector: 'app-user-suggestion-add',
  templateUrl: './user-suggestion-add.component.html',
  styleUrls: ['./user-suggestion-add.component.scss'],
})
export class UserSuggestionAddComponent extends BaseComponent implements OnInit {
  @ViewChild('suggestionFrm', { static: true }) form: any;

  model = {
    category: '',
    information: '',
    anonymously: false,
  };
  categoryList = [];
  constructor(private suggestionService: SuggestionService) {
    super();
  }

  ngOnInit() {
    this.getActiveCategoryList();
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
   * Create/Update Suggestion data
   */
  public onSuggestionSave() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const data = {
      category: this.model.category,
      information: this.model.information,
      post_anonymously: this.model.anonymously === true ? 0 : 1,
    };
    this.loader.showLoader();
    this.suggestionService
      .createUserSuggestion(data)
      .pipe(first())
      .subscribe(
        (resData) => {
          this.loader.hideLoader();
          if (resData.meta.status) {
            this.toastr.success(resData.meta.message);
            this.router.navigate(['/user-suggestion/list']);
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
