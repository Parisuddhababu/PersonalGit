import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import * as _ from 'lodash';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    _.set(window, 'i18n.' + params.key, '');
    return params.key;
  }
}
