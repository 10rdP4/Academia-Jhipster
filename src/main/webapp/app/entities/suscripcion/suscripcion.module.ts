import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SuscripcionComponent } from './list/suscripcion.component';
import { SuscripcionDetailComponent } from './detail/suscripcion-detail.component';
import { SuscripcionUpdateComponent } from './update/suscripcion-update.component';
import { SuscripcionDeleteDialogComponent } from './delete/suscripcion-delete-dialog.component';
import { SuscripcionRoutingModule } from './route/suscripcion-routing.module';

@NgModule({
  imports: [SharedModule, SuscripcionRoutingModule],
  declarations: [SuscripcionComponent, SuscripcionDetailComponent, SuscripcionUpdateComponent, SuscripcionDeleteDialogComponent],
  entryComponents: [SuscripcionDeleteDialogComponent],
})
export class SuscripcionModule {}
