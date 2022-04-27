import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfesor } from '../profesor.model';
import { ProfesorService } from '../service/profesor.service';

@Component({
  templateUrl: './profesor-delete-dialog.component.html',
})
export class ProfesorDeleteDialogComponent {
  profesor?: IProfesor;

  constructor(protected profesorService: ProfesorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.profesorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
