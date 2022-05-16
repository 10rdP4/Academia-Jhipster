import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'jhi-creacion-taller',
  templateUrl: './creacion-taller.component.html',
  styleUrls: ['./creacion-taller.component.scss'],
})
export class CreacionTallerComponent implements OnInit {
  titulo = '';

  constructor() {
    this.titulo = '';
  }

  ngOnInit(): void {
    this.titulo = '';
  }
}
