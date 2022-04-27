import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContactoComponent } from './list/contacto.component';
import { ContactoDetailComponent } from './detail/contacto-detail.component';
import { ContactoUpdateComponent } from './update/contacto-update.component';
import { ContactoDeleteDialogComponent } from './delete/contacto-delete-dialog.component';
import { ContactoRoutingModule } from './route/contacto-routing.module';

@NgModule({
  imports: [SharedModule, ContactoRoutingModule],
  declarations: [ContactoComponent, ContactoDetailComponent, ContactoUpdateComponent, ContactoDeleteDialogComponent],
  entryComponents: [ContactoDeleteDialogComponent],
})
export class ContactoModule {}
