import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

function validateRequiredRadioInGroup(): ValidatorFn {
  return (group: any) => {
    let isValid = false;

    if (group) {
      for (const ctrl in group.controls) {
        if (group.controls[ctrl].value && typeof group.controls[ctrl].value === 'string') {
          isValid = group.controls[ctrl].value;
        }
      }
    }

    if (isValid) {
      return null;
    } else {
      return { radioRequired: true };
    }
  };
}
@Directive({
  selector: '[appMultiRadioValidation]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MultiRadioValidationDirective, multi: true }],
})
export class MultiRadioValidationDirective implements Validator {
  private valFn = Validators.nullValidator;

  constructor() {
    this.valFn = validateRequiredRadioInGroup();
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}
