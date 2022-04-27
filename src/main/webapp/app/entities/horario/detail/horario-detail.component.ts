import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHorario } from '../horario.model';

@Component({
  selector: 'jhi-horario-detail',
  templateUrl: './horario-detail.component.html',
})
export class HorarioDetailComponent implements OnInit {
  horario: IHorario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ horario }) => {
      this.horario = horario;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
