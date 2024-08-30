import * as _ from 'lodash';

export function AutoUnsubscribe(deniedProp: string[] = []) {
  return function (constructor: any) {
    const original = _.get(constructor, 'prototype.ngOnDestroy', null);

    constructor.prototype.ngOnDestroy = function () {
      for (const prop in this) {
        if (Object.prototype.hasOwnProperty.call(this, prop)) {
          const property = _.get(this, prop);
          const _rxProp = _.includes(deniedProp, prop);

          if (!_rxProp) {
            if (property && typeof property.unsubscribe === 'function') {
              property.unsubscribe();
            }
          }
        }
      }

      if (original && typeof original === 'function') {
        original.apply(this, arguments);
      }
    };
  };
}
