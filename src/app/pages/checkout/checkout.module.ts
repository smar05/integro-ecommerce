import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CheckoutComponent],
  imports: [CheckoutRoutingModule, CommonModule, FormsModule],
})
export class CheckoutModule {}
