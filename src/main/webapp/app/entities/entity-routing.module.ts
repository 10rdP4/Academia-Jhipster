import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'alumno',
        data: { pageTitle: 'academiaApp.alumno.home.title' },
        loadChildren: () => import('./alumno/alumno.module').then(m => m.AlumnoModule),
      },
      {
        path: 'contacto',
        data: { pageTitle: 'academiaApp.contacto.home.title' },
        loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoModule),
      },
      {
        path: 'suscripcion',
        data: { pageTitle: 'academiaApp.suscripcion.home.title' },
        loadChildren: () => import('./suscripcion/suscripcion.module').then(m => m.SuscripcionModule),
      },
      {
        path: 'taller',
        data: { pageTitle: 'academiaApp.taller.home.title' },
        loadChildren: () => import('./taller/taller.module').then(m => m.TallerModule),
      },
      {
        path: 'profesor',
        data: { pageTitle: 'academiaApp.profesor.home.title' },
        loadChildren: () => import('./profesor/profesor.module').then(m => m.ProfesorModule),
      },
      {
        path: 'asistencia',
        data: { pageTitle: 'academiaApp.asistencia.home.title' },
        loadChildren: () => import('./asistencia/asistencia.module').then(m => m.AsistenciaModule),
      },
      {
        path: 'horario',
        data: { pageTitle: 'academiaApp.horario.home.title' },
        loadChildren: () => import('./horario/horario.module').then(m => m.HorarioModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
