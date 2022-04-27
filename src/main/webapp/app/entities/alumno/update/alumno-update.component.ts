import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAlumno, Alumno } from '../alumno.model';
import { AlumnoService } from '../service/alumno.service';
import { IContacto } from 'app/entities/contacto/contacto.model';
import { ContactoService } from 'app/entities/contacto/service/contacto.service';

@Component({
  selector: 'jhi-alumno-update',
  templateUrl: './alumno-update.component.html',
})
export class AlumnoUpdateComponent implements OnInit {
  isSaving = false;

  contactosSharedCollection: IContacto[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required]],
    apellido: [],
    contacto: [],
  });

  constructor(
    protected alumnoService: AlumnoService,
    protected contactoService: ContactoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ alumno }) => {
      this.updateForm(alumno);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const alumno = this.createFromForm();
    if (alumno.id !== undefined) {
      this.subscribeToSaveResponse(this.alumnoService.update(alumno));
    } else {
      this.subscribeToSaveResponse(this.alumnoService.create(alumno));
    }
  }

  trackContactoById(index: number, item: IContacto): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlumno>>): void {
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

  protected updateForm(alumno: IAlumno): void {
    this.editForm.patchValue({
      id: alumno.id,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      contacto: alumno.contacto,
    });

    this.contactosSharedCollection = this.contactoService.addContactoToCollectionIfMissing(this.contactosSharedCollection, alumno.contacto);
  }

  protected loadRelationshipsOptions(): void {
    this.contactoService
      .query()
      .pipe(map((res: HttpResponse<IContacto[]>) => res.body ?? []))
      .pipe(
        map((contactos: IContacto[]) =>
          this.contactoService.addContactoToCollectionIfMissing(contactos, this.editForm.get('contacto')!.value)
        )
      )
      .subscribe((contactos: IContacto[]) => (this.contactosSharedCollection = contactos));
  }

  protected createFromForm(): IAlumno {
    return {
      ...new Alumno(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellido: this.editForm.get(['apellido'])!.value,
      contacto: this.editForm.get(['contacto'])!.value,
    };
  }
}
