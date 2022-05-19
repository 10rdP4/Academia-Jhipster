import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormularioSuscripcionComponent } from './formulario-suscripcion/formulario-suscripcion.component';
import { HorarioSemanalComponent } from './horario-semanal/horario-semanal.component';
import { AsistenciasTalleresComponent } from './asistencias-talleres/asistencias-talleres.component';
import { CreacionProfesorComponent } from './creacion-profesor/creacion-profesor.component';
import { CreacionTallerComponent } from './creacion-taller/creacion-taller.component';
import { InfoAlumnosComponent } from './info-alumnos/info-alumnos.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: 'nueva-suscripcion',
          component: FormularioSuscripcionComponent,
          data:{
            authorities: [Authority.ADMIN, Authority.GESTOR],
          },
          canActivate: [UserRouteAccessService]
        },
        {
          path: 'horario-semanal',
          component: HorarioSemanalComponent,
          data:{
            authorities: [Authority.ADMIN, Authority.GESTOR],
          },
          canActivate: [UserRouteAccessService]
        },
        {
          path: 'asistencias',
          component: AsistenciasTalleresComponent,
          data:{
            authorities: [Authority.ADMIN, Authority.GESTOR, Authority.PROFESOR],
          },
          canActivate: [UserRouteAccessService]
        },
        {
          path: 'nuevo-profesor',
          component: CreacionProfesorComponent,
          data:{
            authorities: [Authority.ADMIN, Authority.GESTOR],
          },
          canActivate: [UserRouteAccessService]
        },
        {
          path: 'nuevo-taller',
          component: CreacionTallerComponent,
          data:{
            authorities: [Authority.ADMIN, Authority.GESTOR],
          },
          canActivate: [UserRouteAccessService]
        },
        {
          path: 'info-alumnos',
          component: InfoAlumnosComponent,
          data:{
            authorities: [Authority.ADMIN, Authority.GESTOR],
          },
          canActivate: [UserRouteAccessService]
        },
        {
          path: 'estadisticas',
          component: EstadisticasComponent,
          data:{
            authorities: [Authority.ADMIN, Authority.GESTOR],
          },
          canActivate: [UserRouteAccessService]
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
