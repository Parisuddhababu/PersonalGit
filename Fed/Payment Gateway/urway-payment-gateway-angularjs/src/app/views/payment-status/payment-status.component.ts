import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PAYMETRESPONSESTATUS } from 'src/app/config/app-constant';
import { URWAYResponseCode } from 'src/app/config/urway-response';
import { PaymentStatusProps } from 'src/app/model/payment-status';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  paymentResponse = {} as PaymentStatusProps;
  paymentStatus = PAYMETRESPONSESTATUS;
  urwayPaymentMSG: string = '';

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.paymentResponse = params as PaymentStatusProps;
        const responseCode = params['ResponseCode'] as string;
        this.urwayPaymentMSG = URWAYResponseCode.responseMessage[responseCode];
      }
      );
  }

  public handleGoToHome() {
    this.router.navigate(['/product-list']);
  }

}
