import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AlumnoComponent } from '../list/alumno.component';
import { AlumnoDetailComponent } from '../detail/alumno-detail.component';
import { AlumnoUpdateComponent } from '../update/alumno-update.component';
import { AlumnoRoutingResolveService } from './alumno-routing-resolve.service';

const alumnoRoute: Routes = [
  {
    path: '',
    component: AlumnoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AlumnoDetailComponent,
    resolve: {
      alumno: AlumnoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AlumnoUpdateComponent,
    resolve: {
      alumno: AlumnoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AlumnoUpdateComponent,
    resolve: {
      alumno: AlumnoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(alumnoRoute)],
  exports: [RouterModule],
})
export class AlumnoRoutingModule {}
