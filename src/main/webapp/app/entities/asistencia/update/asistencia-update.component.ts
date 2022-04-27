import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAsistencia, Asistencia } from '../asistencia.model';
import { AsistenciaService } from '../service/asistencia.service';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { AlumnoService } from 'app/entities/alumno/service/alumno.service';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';

@Component({
  selector: 'jhi-asistencia-update',
  templateUrl: './asistencia-update.component.html',
})
export class AsistenciaUpdateComponent implements OnInit {
  isSaving = false;

  alumnosSharedCollection: IAlumno[] = [];
  tallersSharedCollection: ITaller[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [null, [Validators.required]],
    asistencia: [],
    alumno: [],
    taller: [],
  });

  constructor(
    protected asistenciaService: AsistenciaService,
    protected alumnoService: AlumnoService,
    protected tallerService: TallerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asistencia }) => {
      if (asistencia.id === undefined) {
        const today = dayjs().startOf('day');
        asistencia.fecha = today;
      }

      this.updateForm(asistencia);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const asistencia = this.createFromForm();
    if (asistencia.id !== undefined) {
      this.subscribeToSaveResponse(this.asistenciaService.update(asistencia));
    } else {
      this.subscribeToSaveResponse(this.asistenciaService.create(asistencia));
    }
  }

  trackAlumnoById(index: number, item: IAlumno): number {
    return item.id!;
  }

  trackTallerById(index: number, item: ITaller): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAsistencia>>): void {
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

  protected updateForm(asistencia: IAsistencia): void {
    this.editForm.patchValue({
      id: asistencia.id,
      fecha: asistencia.fecha ? asistencia.fecha.format(DATE_TIME_FORMAT) : null,
      asistencia: asistencia.asistencia,
      alumno: asistencia.alumno,
      taller: asistencia.taller,
    });

    this.alumnosSharedCollection = this.alumnoService.addAlumnoToCollectionIfMissing(this.alumnosSharedCollection, asistencia.alumno);
    this.tallersSharedCollection = this.tallerService.addTallerToCollectionIfMissing(this.tallersSharedCollection, asistencia.taller);
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

  protected createFromForm(): IAsistencia {
    return {
      ...new Asistencia(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
      asistencia: this.editForm.get(['asistencia'])!.value,
      alumno: this.editForm.get(['alumno'])!.value,
      taller: this.editForm.get(['taller'])!.value,
    };
  }
}
