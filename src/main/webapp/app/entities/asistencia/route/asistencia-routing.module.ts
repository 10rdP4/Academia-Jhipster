import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AsistenciaComponent } from '../list/asistencia.component';
import { AsistenciaDetailComponent } from '../detail/asistencia-detail.component';
import { AsistenciaUpdateComponent } from '../update/asistencia-update.component';
import { AsistenciaRoutingResolveService } from './asistencia-routing-resolve.service';

const asistenciaRoute: Routes = [
  {
    path: '',
    component: AsistenciaComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AsistenciaDetailComponent,
    resolve: {
      asistencia: AsistenciaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AsistenciaUpdateComponent,
    resolve: {
      asistencia: AsistenciaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AsistenciaUpdateComponent,
    resolve: {
      asistencia: AsistenciaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(asistenciaRoute)],
  exports: [RouterModule],
})
export class AsistenciaRoutingModule {}
