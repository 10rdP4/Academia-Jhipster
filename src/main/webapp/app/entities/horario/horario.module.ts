import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HorarioComponent } from './list/horario.component';
import { HorarioDetailComponent } from './detail/horario-detail.component';
import { HorarioUpdateComponent } from './update/horario-update.component';
import { HorarioDeleteDialogComponent } from './delete/horario-delete-dialog.component';
import { HorarioRoutingModule } from './route/horario-routing.module';
import { HorarioInfoModalComponent } from 'app/horario-semanal/horario-info-modal/horario-info-modal.component';

@NgModule({
  imports: [SharedModule, HorarioRoutingModule],
  declarations: [HorarioComponent, HorarioDetailComponent, HorarioUpdateComponent, HorarioDeleteDialogComponent],
  entryComponents: [HorarioDeleteDialogComponent, HorarioInfoModalComponent],
})
export class HorarioModule {}
