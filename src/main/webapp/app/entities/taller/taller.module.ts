import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TallerComponent } from './list/taller.component';
import { TallerDetailComponent } from './detail/taller-detail.component';
import { TallerUpdateComponent } from './update/taller-update.component';
import { TallerDeleteDialogComponent } from './delete/taller-delete-dialog.component';
import { TallerRoutingModule } from './route/taller-routing.module';

@NgModule({
  imports: [SharedModule, TallerRoutingModule],
  declarations: [TallerComponent, TallerDetailComponent, TallerUpdateComponent, TallerDeleteDialogComponent],
  entryComponents: [TallerDeleteDialogComponent],
})
export class TallerModule {}
