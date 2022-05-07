import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IContacto, Contacto } from '../contacto.model';
import { ContactoService } from '../service/contacto.service';

@Component({
  selector: 'jhi-contacto-update',
  templateUrl: './contacto-update.component.html',
})
export class ContactoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required]],
    telefono: [],
    correo: [],
    dni: [null, [Validators.required]],
  });

  constructor(protected contactoService: ContactoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contacto }) => {
      this.updateForm(contacto);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contacto = this.createFromForm();
    if (contacto.id !== undefined) {
      this.subscribeToSaveResponse(this.contactoService.update(contacto));
    } else {
      this.subscribeToSaveResponse(this.contactoService.create(contacto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContacto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(contacto: IContacto): void {
    this.editForm.patchValue({
      id: contacto.id,
      nombre: contacto.nombre,
      telefono: contacto.telefono,
      correo: contacto.correo,
      dni: contacto.dni,
    });
  }

  protected createFromForm(): IContacto {
    return {
      ...new Contacto(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      telefono: this.editForm.get(['telefono'])!.value,
      correo: this.editForm.get(['correo'])!.value,
      dni: this.editForm.get(['dni'])!.value,
    };
  }
}
