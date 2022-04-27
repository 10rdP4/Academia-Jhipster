import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProfesorComponent } from './list/profesor.component';
import { ProfesorDetailComponent } from './detail/profesor-detail.component';
import { ProfesorUpdateComponent } from './update/profesor-update.component';
import { ProfesorDeleteDialogComponent } from './delete/profesor-delete-dialog.component';
import { ProfesorRoutingModule } from './route/profesor-routing.module';

@NgModule({
  imports: [SharedModule, ProfesorRoutingModule],
  declarations: [ProfesorComponent, ProfesorDetailComponent, ProfesorUpdateComponent, ProfesorDeleteDialogComponent],
  entryComponents: [ProfesorDeleteDialogComponent],
})
export class ProfesorModule {}
