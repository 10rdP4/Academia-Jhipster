import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ITaller } from 'app/entities/taller/taller.model';

@Component({
  selector: 'jhi-horario-info-modal',
  templateUrl: "./horario-info-modal.component.html"
})
export class HorarioInfoModalComponent {
  taller:ITaller = {}

  constructor(public activeModal: NgbActiveModal) {}
}