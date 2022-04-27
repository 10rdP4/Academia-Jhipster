import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HorarioComponent } from './list/horario.component';
import { HorarioDetailComponent } from './detail/horario-detail.component';
import { HorarioUpdateComponent } from './update/horario-update.component';
import { HorarioDeleteDialogComponent } from './delete/horario-delete-dialog.component';
import { HorarioRoutingModule } from './route/horario-routing.module';

@NgModule({
  imports: [SharedModule, HorarioRoutingModule],
  declarations: [HorarioComponent, HorarioDetailComponent, HorarioUpdateComponent, HorarioDeleteDialogComponent],
  entryComponents: [HorarioDeleteDialogComponent],
})
export class HorarioModule {}
