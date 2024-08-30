import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs';
import { CartService } from 'src/app/_services/cart.service';
import { CONFIG } from 'src/app/config/app-config';
import { CONFIGCONST } from 'src/app/config/app-constant';
import { ICartForm, IPaynowApiRequestParam } from 'src/app/model/cart';
import { generateSecureRandomNumber } from 'src/app/utils/helper';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  model: ICartForm = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    customerEmail: '',
    amount: CONFIGCONST.productAmount,
  };
  submitted = false;
  urwayPaymentURL = '';

  constructor(private cartPaymentService: CartService) {}

  ngOnInit(): void {
    /* initialization this method 'ngOnInit' is empty */
  }

  public onCartSave(frm: NgForm) {
    this.submitted = true;
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    const trackId = generateSecureRandomNumber();

    let hashSequence =
      trackId +
      '|' +
      CONFIG.terminalId +
      '|' +
      CONFIG.password +
      '|' +
      CONFIG.merchantKey +
      '|' +
      this.model.amount +
      '|' +
      CONFIGCONST.currency.toUpperCase();
    let hash = Utils.generateHash(hashSequence);

    const formData = {
      customerName: `${this.model.firstName} ${this.model.lastName}`,
      firstName: this.model.firstName,
      lastName: this.model.lastName,
      address: this.model.address,
      city: this.model.city,
      state: this.model.state,
      zipCode: this.model.zipCode,
      phoneNumber: this.model.phoneNumber,
      country: CONFIGCONST.country,
      trackid: trackId,
      terminalId: CONFIG.terminalId,
      action: CONFIG.action,
      customerEmail: this.model.customerEmail,
      merchantIp: CONFIG.merchantIp,
      password: CONFIG.password,
      currency: CONFIGCONST.currency.toUpperCase(),
      amount: this.model.amount,
      requestHash: hash,
      tokenizationType: CONFIG.tokenizationType,
      udf1: '',
      udf2: 'http://localhost:4200/payment-status',
      udf3: '',
      udf4: '',
      transid: trackId,
    };

    this.handlePaymentCreateRequest(formData as IPaynowApiRequestParam);
  }

  handlePaymentCreateRequest(data: IPaynowApiRequestParam) {
    this.cartPaymentService
      .handlePayNowButtonClick(data)
      .pipe(first())
      .subscribe(
        (resp) => {
          // Do Not change the url generating format as per URWAY required generated URL
          this.urwayPaymentURL = `${resp.targetUrl}?paymentid=${resp.payid}`;
          window.location.href = this.urwayPaymentURL;
        },
        (error) => {
          console.log(error, 'error');
        }
      );
  }
}
