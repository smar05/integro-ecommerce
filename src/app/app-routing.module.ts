import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { EnumRutas } from './enums/enum-rutas';

const routes: Routes = [
  {
    path: '**',
    redirectTo: EnumRutas.HOME,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    PagesRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
