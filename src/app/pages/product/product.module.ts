import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductComponent],
  imports: [ProductRoutingModule, CommonModule, FormsModule],
})
export class ProductModule {}
