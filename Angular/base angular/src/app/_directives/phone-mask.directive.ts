import {
  Directive,
  HostListener,
  Input,
  ElementRef,
  OnInit,
  AfterContentInit,
  AfterViewInit,
  AfterViewChecked,
  Output,
  OnChanges,
} from '@angular/core';
import { NgControl, AbstractControl, FormControl, NgForm, Validators, Validator, ValidatorFn, NG_VALIDATORS } from '@angular/forms';
import { parsePhoneNumberFromString, AsYouType, isPossibleNumber } from 'libphonenumber-js';
import IMask from 'imask';
import { EventEmitter } from '@angular/core';
@Directive({
  selector: '[phoneMask][ngModel]',
})
export class PhoneMaskDirective implements OnInit {
  private mask;
  private defaultmask = 'xxxxx xxxxx';
  private asType: any;
  @Output() valueChange: EventEmitter<{}> = new EventEmitter();
  constructor(private el: ElementRef, private control: NgControl) {}
  @Input() config;

  @HostListener('keyup', ['$event'])
  onModelChange(event) {
    this.onValueChnage(event.target.value);
    this.control.control.setValue(this.mask.masked.value);
  }

  ngOnInit() {
    this.asType = new AsYouType(this.config['country']);
    this.asType.had_enough_leading_digits = false;
    this.asType.input('+' + this.asType.countryCallingCode + '9');
    const m = this.asType.partially_populated_template ? this.asType.partially_populated_template.replace(/[0-9]/g, 'x') : '';
    let mask = this.config.mask !== undefined ? this.config.mask : (m as string).replace(/x/g, '0');
    if (this.config['include_country_code'] === true) {
      mask = '+' + this.asType.countryCallingCode + ' ' + mask;
    }
    this.mask = IMask(this.el.nativeElement, { mask: mask });
    setTimeout(() => {
      if (this.el.nativeElement.value.startsWith('+')) {
        this.el.nativeElement.value = this.el.nativeElement.value.substr(this.el.nativeElement.value.indexOf(' '));
      }
      this.mask.updateValue();
      this.el.nativeElement.value = this.mask._value;
      this.onValueChnage(this.mask._value);
      const countryCode = '+' + this.asType.countryCallingCode;
    }, 500);
  }
  private onValueChnage(value) {
    const countryCode = '+' + this.asType.countryCallingCode;
    let number = value;
    if (value.startsWith('+')) {
      number = value.substr(value.indexOf(' '));
    }
    const result = {
      countryCode: countryCode,
      number: number,
      iso_code: this.asType.defaultCountry,
      valid: this.mask.masked.isComplete,
    };
    this.valueChange.emit(result);
  }
}
