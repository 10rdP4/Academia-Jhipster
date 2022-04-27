import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ContactoComponent } from '../list/contacto.component';
import { ContactoDetailComponent } from '../detail/contacto-detail.component';
import { ContactoUpdateComponent } from '../update/contacto-update.component';
import { ContactoRoutingResolveService } from './contacto-routing-resolve.service';

const contactoRoute: Routes = [
  {
    path: '',
    component: ContactoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContactoDetailComponent,
    resolve: {
      contacto: ContactoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContactoUpdateComponent,
    resolve: {
      contacto: ContactoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContactoUpdateComponent,
    resolve: {
      contacto: ContactoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contactoRoute)],
  exports: [RouterModule],
})
export class ContactoRoutingModule {}
