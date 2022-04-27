import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITaller } from '../taller.model';
import { TallerService } from '../service/taller.service';

@Component({
  templateUrl: './taller-delete-dialog.component.html',
})
export class TallerDeleteDialogComponent {
  taller?: ITaller;

  constructor(protected tallerService: TallerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tallerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
