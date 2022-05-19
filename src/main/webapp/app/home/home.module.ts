import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { FormularioSuscripcionComponent } from 'app/formulario-suscripcion/formulario-suscripcion.component';
import { HorarioSemanalComponent } from 'app/horario-semanal/horario-semanal.component';
import { AsistenciasTalleresComponent } from 'app/asistencias-talleres/asistencias-talleres.component';
import { HorarioInfoModalComponent } from 'app/horario-semanal/horario-info-modal/horario-info-modal.component';
import { SuscripcionRegistradaModalComponent } from 'app/formulario-suscripcion/suscripcion-registrada/suscripcion-registrada.component';
import { CreacionProfesorComponent } from 'app/creacion-profesor/creacion-profesor.component';
import { CreacionTallerComponent } from 'app/creacion-taller/creacion-taller.component';
import { InfoAlumnosComponent } from 'app/info-alumnos/info-alumnos.component';
import { EstadisticasComponent } from 'app/estadisticas/estadisticas.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [
    HomeComponent,
    FormularioSuscripcionComponent,
    HorarioSemanalComponent,
    AsistenciasTalleresComponent,
    HorarioInfoModalComponent,
    SuscripcionRegistradaModalComponent,
    CreacionProfesorComponent,
    CreacionTallerComponent,
    InfoAlumnosComponent,
    EstadisticasComponent
  ],
})
export class HomeModule { }
