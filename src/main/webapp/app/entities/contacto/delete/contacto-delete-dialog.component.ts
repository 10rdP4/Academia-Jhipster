import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IContacto } from '../contacto.model';
import { ContactoService } from '../service/contacto.service';

@Component({
  templateUrl: './contacto-delete-dialog.component.html',
})
export class ContactoDeleteDialogComponent {
  contacto?: IContacto;

  constructor(protected contactoService: ContactoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contactoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
