import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SuscripcionService } from "app/entities/suscripcion/service/suscripcion.service";
import { ISuscripcion } from "app/entities/suscripcion/suscripcion.model";
import dayjs from "dayjs/esm";
import { FormularioSuscripcionService } from "../formulario-suscripcion.service";


@Component({
  selector: 'jhi-suscripcion-registrada-modal',
  templateUrl: "./suscripcion-registrada.component.html"
})
export class SuscripcionRegistradaModalComponent {

  activa?:boolean;
  suscripcion:ISuscripcion = {};

  constructor(public activeModal: NgbActiveModal, public formularioSuscripcionService: FormularioSuscripcionService, public suscripcionService: SuscripcionService) {
    this.suscripcion = formularioSuscripcionService.nuevaSuscripcion;
  }

  renovarSuscripcion():void{
    this.suscripcion.activa = true;
    this.suscripcion.fecha = dayjs();

    this.suscripcionService.update(this.suscripcion).subscribe();
    this.formularioSuscripcionService.crearPDFSuscripcion();
    this.activeModal.close();
  }
}