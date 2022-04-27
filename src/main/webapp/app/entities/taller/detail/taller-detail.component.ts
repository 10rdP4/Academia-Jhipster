import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITaller } from '../taller.model';

@Component({
  selector: 'jhi-taller-detail',
  templateUrl: './taller-detail.component.html',
})
export class TallerDetailComponent implements OnInit {
  taller: ITaller | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taller }) => {
      this.taller = taller;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
