import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProfesor } from '../profesor.model';

@Component({
  selector: 'jhi-profesor-detail',
  templateUrl: './profesor-detail.component.html',
})
export class ProfesorDetailComponent implements OnInit {
  profesor: IProfesor | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profesor }) => {
      this.profesor = profesor;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
