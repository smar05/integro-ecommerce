import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingModule } from './home/home-routing.module';
import { EnumRutas } from '../enums/enum-rutas';

const routes: Routes = [
  {
    path: EnumRutas.HOME,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: EnumRutas.PRODUCT,
    loadChildren: () =>
      import('./product/product.module').then((m) => m.ProductModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), HomeRoutingModule],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
