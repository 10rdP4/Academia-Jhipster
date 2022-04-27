import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHorario } from '../horario.model';
import { HorarioService } from '../service/horario.service';

@Component({
  templateUrl: './horario-delete-dialog.component.html',
})
export class HorarioDeleteDialogComponent {
  horario?: IHorario;

  constructor(protected horarioService: HorarioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.horarioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
