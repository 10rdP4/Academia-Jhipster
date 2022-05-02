import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITaller, Taller } from '../taller.model';
import { TallerService } from '../service/taller.service';
import { IProfesor } from 'app/entities/profesor/profesor.model';
import { ProfesorService } from 'app/entities/profesor/service/profesor.service';

@Component({
  selector: 'jhi-taller-update',
  templateUrl: './taller-update.component.html',
})
export class TallerUpdateComponent implements OnInit {
  isSaving = false;

  profesorsSharedCollection: IProfesor[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required]],
    precio: [null, [Validators.required]],
    descripcion: [],
    profesor: [],
  });

  constructor(
    protected tallerService: TallerService,
    protected profesorService: ProfesorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taller }) => {
      this.updateForm(taller);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const taller = this.createFromForm();
    if (taller.id !== undefined) {
      this.subscribeToSaveResponse(this.tallerService.update(taller));
    } else {
      this.subscribeToSaveResponse(this.tallerService.create(taller));
    }
  }

  trackProfesorById(index: number, item: IProfesor): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaller>>): void {
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

  protected updateForm(taller: ITaller): void {
    this.editForm.patchValue({
      id: taller.id,
      nombre: taller.nombre,
      precio: taller.precio,
      descripcion: taller.descripcion,
      profesor: taller.profesor,
    });

    this.profesorsSharedCollection = this.profesorService.addProfesorToCollectionIfMissing(this.profesorsSharedCollection, taller.profesor);
  }

  protected loadRelationshipsOptions(): void {
    this.profesorService
      .query()
      .pipe(map((res: HttpResponse<IProfesor[]>) => res.body ?? []))
      .pipe(
        map((profesors: IProfesor[]) =>
          this.profesorService.addProfesorToCollectionIfMissing(profesors, this.editForm.get('profesor')!.value)
        )
      )
      .subscribe((profesors: IProfesor[]) => (this.profesorsSharedCollection = profesors));
  }

  protected createFromForm(): ITaller {
    return {
      ...new Taller(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      precio: this.editForm.get(['precio'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      profesor: this.editForm.get(['profesor'])!.value,
    };
  }
}
