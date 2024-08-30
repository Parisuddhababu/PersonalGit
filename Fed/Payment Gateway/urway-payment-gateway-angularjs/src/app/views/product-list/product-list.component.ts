import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIGCONST } from 'src/app/config/app-constant';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  constructor(private router: Router) { }

  productPrice: number = CONFIGCONST.productAmount;


  public handleAddTocartClick() {
    this.router.navigate(['/cart']);
  }

}
