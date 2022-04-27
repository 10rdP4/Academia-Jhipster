import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContacto } from '../contacto.model';

@Component({
  selector: 'jhi-contacto-detail',
  templateUrl: './contacto-detail.component.html',
})
export class ContactoDetailComponent implements OnInit {
  contacto: IContacto | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contacto }) => {
      this.contacto = contacto;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
