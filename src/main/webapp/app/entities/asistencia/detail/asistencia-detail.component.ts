import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAsistencia } from '../asistencia.model';

@Component({
  selector: 'jhi-asistencia-detail',
  templateUrl: './asistencia-detail.component.html',
})
export class AsistenciaDetailComponent implements OnInit {
  asistencia: IAsistencia | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asistencia }) => {
      this.asistencia = asistencia;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
