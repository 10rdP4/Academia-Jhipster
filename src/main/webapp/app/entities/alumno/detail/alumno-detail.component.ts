import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAlumno } from '../alumno.model';

@Component({
  selector: 'jhi-alumno-detail',
  templateUrl: './alumno-detail.component.html',
})
export class AlumnoDetailComponent implements OnInit {
  alumno: IAlumno | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ alumno }) => {
      this.alumno = alumno;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
