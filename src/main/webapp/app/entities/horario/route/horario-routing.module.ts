import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HorarioComponent } from '../list/horario.component';
import { HorarioDetailComponent } from '../detail/horario-detail.component';
import { HorarioUpdateComponent } from '../update/horario-update.component';
import { HorarioRoutingResolveService } from './horario-routing-resolve.service';

const horarioRoute: Routes = [
  {
    path: '',
    component: HorarioComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HorarioDetailComponent,
    resolve: {
      horario: HorarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HorarioUpdateComponent,
    resolve: {
      horario: HorarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HorarioUpdateComponent,
    resolve: {
      horario: HorarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(horarioRoute)],
  exports: [RouterModule],
})
export class HorarioRoutingModule {}
