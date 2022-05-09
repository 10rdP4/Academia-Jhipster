import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { FormularioSuscripcionComponent } from 'app/formulario-suscripcion/formulario-suscripcion.component';
import { HorarioSemanalComponent } from 'app/horario-semanal/horario-semanal.component';
import { AsistenciasTalleresComponent } from 'app/asistencias-talleres/asistencias-talleres.component';
import { HorarioInfoModalComponent } from 'app/horario-semanal/horario-info-modal/horario-info-modal.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent,
    FormularioSuscripcionComponent,
    HorarioSemanalComponent,
    AsistenciasTalleresComponent,
    HorarioInfoModalComponent],
})
export class HomeModule { }
