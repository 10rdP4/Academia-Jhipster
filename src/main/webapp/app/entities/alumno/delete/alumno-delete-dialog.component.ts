import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAlumno } from '../alumno.model';
import { AlumnoService } from '../service/alumno.service';

@Component({
  templateUrl: './alumno-delete-dialog.component.html',
})
export class AlumnoDeleteDialogComponent {
  alumno?: IAlumno;

  constructor(protected alumnoService: AlumnoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.alumnoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
