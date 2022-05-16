import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'jhi-creacion-profesor',
  templateUrl: './creacion-profesor.component.html',
  styleUrls: ['./creacion-profesor.component.scss'],
})
export class CreacionProfesorComponent implements OnInit {
  titulo = '';

  constructor() {
    this.titulo = '';
  }

  ngOnInit(): void {
    this.titulo = '';
  }
}
