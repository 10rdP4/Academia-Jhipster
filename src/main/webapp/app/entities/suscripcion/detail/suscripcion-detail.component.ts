import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISuscripcion } from '../suscripcion.model';

@Component({
  selector: 'jhi-suscripcion-detail',
  templateUrl: './suscripcion-detail.component.html',
})
export class SuscripcionDetailComponent implements OnInit {
  suscripcion: ISuscripcion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ suscripcion }) => {
      this.suscripcion = suscripcion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
