import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SuscripcionComponent } from '../list/suscripcion.component';
import { SuscripcionDetailComponent } from '../detail/suscripcion-detail.component';
import { SuscripcionUpdateComponent } from '../update/suscripcion-update.component';
import { SuscripcionRoutingResolveService } from './suscripcion-routing-resolve.service';

const suscripcionRoute: Routes = [
  {
    path: '',
    component: SuscripcionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SuscripcionDetailComponent,
    resolve: {
      suscripcion: SuscripcionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SuscripcionUpdateComponent,
    resolve: {
      suscripcion: SuscripcionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SuscripcionUpdateComponent,
    resolve: {
      suscripcion: SuscripcionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(suscripcionRoute)],
  exports: [RouterModule],
})
export class SuscripcionRoutingModule {}
