import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-resumen-suscripcion-modal',
  templateUrl: "./resumen-suscripcion-modal.component.html"
})
export class ResumenSuscripcionModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}