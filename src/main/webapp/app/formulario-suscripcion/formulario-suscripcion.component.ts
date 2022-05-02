import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'jhi-formulario-suscripcion',
  templateUrl: './formulario-suscripcion.component.html',
  styleUrls: ['./formulario-suscripcion.component.scss'],
})
export class FormularioSuscripcionComponent implements OnInit {
  titulo = ''

  constructor() {
    this.titulo = ''
  }

  ngOnInit(): void {
    this.titulo = ''
  }
}