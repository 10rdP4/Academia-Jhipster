import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISuscripcion, Suscripcion } from '../suscripcion.model';
import { SuscripcionService } from '../service/suscripcion.service';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { AlumnoService } from 'app/entities/alumno/service/alumno.service';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';

@Component({
  selector: 'jhi-suscripcion-update',
  templateUrl: './suscripcion-update.component.html',
})
export class SuscripcionUpdateComponent implements OnInit {
  isSaving = false;

  alumnosSharedCollection: IAlumno[] = [];
  tallersSharedCollection: ITaller[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [null, [Validators.required]],
    activa: [],
    alumno: [],
    taller: [],
  });

  constructor(
    protected suscripcionService: SuscripcionService,
    protected alumnoService: AlumnoService,
    protected tallerService: TallerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ suscripcion }) => {
      if (suscripcion.id === undefined) {
        const today = dayjs().startOf('day');
        suscripcion.fecha = today;
      }

      this.updateForm(suscripcion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const suscripcion = this.createFromForm();
    if (suscripcion.id !== undefined) {
      this.subscribeToSaveResponse(this.suscripcionService.update(suscripcion));
    } else {
      this.subscribeToSaveResponse(this.suscripcionService.create(suscripcion));
    }
  }

  trackAlumnoById(index: number, item: IAlumno): number {
    return item.id!;
  }

  trackTallerById(index: number, item: ITaller): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISuscripcion>>): void {
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

  protected updateForm(suscripcion: ISuscripcion): void {
    this.editForm.patchValue({
      id: suscripcion.id,
      fecha: suscripcion.fecha ? suscripcion.fecha.format(DATE_TIME_FORMAT) : null,
      activa: suscripcion.activa,
      alumno: suscripcion.alumno,
      taller: suscripcion.taller,
    });

    this.alumnosSharedCollection = this.alumnoService.addAlumnoToCollectionIfMissing(this.alumnosSharedCollection, suscripcion.alumno);
    this.tallersSharedCollection = this.tallerService.addTallerToCollectionIfMissing(this.tallersSharedCollection, suscripcion.taller);
  }

  protected loadRelationshipsOptions(): void {
    this.alumnoService
      .query()
      .pipe(map((res: HttpResponse<IAlumno[]>) => res.body ?? []))
      .pipe(map((alumnos: IAlumno[]) => this.alumnoService.addAlumnoToCollectionIfMissing(alumnos, this.editForm.get('alumno')!.value)))
      .subscribe((alumnos: IAlumno[]) => (this.alumnosSharedCollection = alumnos));

    this.tallerService
      .query()
      .pipe(map((res: HttpResponse<ITaller[]>) => res.body ?? []))
      .pipe(map((tallers: ITaller[]) => this.tallerService.addTallerToCollectionIfMissing(tallers, this.editForm.get('taller')!.value)))
      .subscribe((tallers: ITaller[]) => (this.tallersSharedCollection = tallers));
  }

  protected createFromForm(): ISuscripcion {
    return {
      ...new Suscripcion(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
      activa: this.editForm.get(['activa'])!.value,
      alumno: this.editForm.get(['alumno'])!.value,
      taller: this.editForm.get(['taller'])!.value,
    };
  }
}
