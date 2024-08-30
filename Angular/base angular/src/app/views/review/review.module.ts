import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoaderModule } from '../../containers';
import { SharedModule } from '../../_module/shared.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { RatingModule } from 'ngx-bootstrap/rating';

@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReviewRoutingModule,
    NgxDatatableModule,
    NgxPermissionsModule,
    PopoverModule.forRoot(),
    RatingModule.forRoot(),
    LoaderModule,
    SharedModule,
  ],
})
export class ReviewModule {}
