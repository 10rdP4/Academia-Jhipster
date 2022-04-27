import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AsistenciaComponent } from './list/asistencia.component';
import { AsistenciaDetailComponent } from './detail/asistencia-detail.component';
import { AsistenciaUpdateComponent } from './update/asistencia-update.component';
import { AsistenciaDeleteDialogComponent } from './delete/asistencia-delete-dialog.component';
import { AsistenciaRoutingModule } from './route/asistencia-routing.module';

@NgModule({
  imports: [SharedModule, AsistenciaRoutingModule],
  declarations: [AsistenciaComponent, AsistenciaDetailComponent, AsistenciaUpdateComponent, AsistenciaDeleteDialogComponent],
  entryComponents: [AsistenciaDeleteDialogComponent],
})
export class AsistenciaModule {}
