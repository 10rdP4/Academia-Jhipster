import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TallerComponent } from '../list/taller.component';
import { TallerDetailComponent } from '../detail/taller-detail.component';
import { TallerUpdateComponent } from '../update/taller-update.component';
import { TallerRoutingResolveService } from './taller-routing-resolve.service';

const tallerRoute: Routes = [
  {
    path: '',
    component: TallerComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TallerDetailComponent,
    resolve: {
      taller: TallerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TallerUpdateComponent,
    resolve: {
      taller: TallerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TallerUpdateComponent,
    resolve: {
      taller: TallerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tallerRoute)],
  exports: [RouterModule],
})
export class TallerRoutingModule {}
