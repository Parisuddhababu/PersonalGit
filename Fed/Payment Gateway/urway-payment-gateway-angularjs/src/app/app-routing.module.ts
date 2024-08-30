import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentStatusComponent } from './views/payment-status/payment-status.component';

const routes: Routes = [
  {path: '', redirectTo: 'product-list', pathMatch: 'full'},
  {
    path: 'product-list',
    loadChildren: () => import('./views/product-list/product-list.module').then(m => m.ProductListModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./views/cart/cart.module').then(m => m.CartModule)
  },
  {
    path: 'payment-status',
    component: PaymentStatusComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
