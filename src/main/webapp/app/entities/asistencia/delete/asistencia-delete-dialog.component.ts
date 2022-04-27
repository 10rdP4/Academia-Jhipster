import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAsistencia } from '../asistencia.model';
import { AsistenciaService } from '../service/asistencia.service';

@Component({
  templateUrl: './asistencia-delete-dialog.component.html',
})
export class AsistenciaDeleteDialogComponent {
  asistencia?: IAsistencia;

  constructor(protected asistenciaService: AsistenciaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.asistenciaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
