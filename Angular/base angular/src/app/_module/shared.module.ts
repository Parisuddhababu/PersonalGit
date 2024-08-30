import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BaseComponent } from '../_components/base.component';
import { DataTableKeyPressScrollDirective } from '../_directives/datatable-key-press-scroll.directive';
import { InvalidFormScrollNGFormDirective } from '../_directives/invalid-form-scroll-ngform.directive';
import { MultiRadioValidationDirective } from '../_directives/multi-radio-validation.directive';
import { NumberOnlyDirective } from '../_directives/number-only.directive';
import { PhoneMaskDirective } from '../_directives/phone-mask.directive';
import { MyMissingTranslationHandler } from '../_helpers/translator';
import { CustomDate } from '../_pipe/customDate.pipe';
import { FormatCkEditorObjectPipe } from '../_pipe/format-ck-editor-object.pipe';
import { ChatLoaderDirective } from './../_directives/chat-loader.directive';
import { SpaceRemoveDirective } from './../_directives/space-remove.directive';

@NgModule({
  declarations: [
    BaseComponent,
    CustomDate,
    FormatCkEditorObjectPipe,
    PhoneMaskDirective,
    NumberOnlyDirective,
    InvalidFormScrollNGFormDirective,
    DataTableKeyPressScrollDirective,
    MultiRadioValidationDirective,
    ChatLoaderDirective,
    SpaceRemoveDirective,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    CustomDate,
    FormatCkEditorObjectPipe,
    TranslatePipe,
    PhoneMaskDirective,
    NumberOnlyDirective,
    InvalidFormScrollNGFormDirective,
    DataTableKeyPressScrollDirective,
    MultiRadioValidationDirective,
    ChatLoaderDirective,
    SpaceRemoveDirective,
  ],
})
export class SharedModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
