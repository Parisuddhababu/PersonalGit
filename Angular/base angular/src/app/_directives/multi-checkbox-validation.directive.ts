import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators, ValidatorFn } from '@angular/forms';

function validateRequiredCheckboxInGroup(): ValidatorFn {
  return (group: any) => {
    let isValid = false;
    if (group) {
      for (const ctrl in group.controls) {
        if (group.controls[ctrl].value && typeof group.controls[ctrl].value === 'boolean') {
          isValid = group.controls[ctrl].value;
        }
      }
    }

    if (isValid) {
      return null;
    } else {
      return { checkboxRequired: true };
    }
  };
}
@Directive({
  selector: '[appMultiCheckboxValidation]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MultiCheckboxValidationDirective, multi: true }],
})
export class MultiCheckboxValidationDirective implements Validator {
  private valFn = Validators.nullValidator;

  constructor() {
    this.valFn = validateRequiredCheckboxInGroup();
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }
}
