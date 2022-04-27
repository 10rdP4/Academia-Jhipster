import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISuscripcion } from '../suscripcion.model';
import { SuscripcionService } from '../service/suscripcion.service';

@Component({
  templateUrl: './suscripcion-delete-dialog.component.html',
})
export class SuscripcionDeleteDialogComponent {
  suscripcion?: ISuscripcion;

  constructor(protected suscripcionService: SuscripcionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.suscripcionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
