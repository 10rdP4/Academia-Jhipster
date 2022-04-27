import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHorario, Horario } from '../horario.model';
import { HorarioService } from '../service/horario.service';
import { ITaller } from 'app/entities/taller/taller.model';
import { TallerService } from 'app/entities/taller/service/taller.service';

@Component({
  selector: 'jhi-horario-update',
  templateUrl: './horario-update.component.html',
})
export class HorarioUpdateComponent implements OnInit {
  isSaving = false;

  tallersSharedCollection: ITaller[] = [];

  editForm = this.fb.group({
    id: [],
    diaSemana: [null, [Validators.required]],
    horaInicioTaller: [],
    taller: [],
  });

  constructor(
    protected horarioService: HorarioService,
    protected tallerService: TallerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ horario }) => {
      this.updateForm(horario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const horario = this.createFromForm();
    if (horario.id !== undefined) {
      this.subscribeToSaveResponse(this.horarioService.update(horario));
    } else {
      this.subscribeToSaveResponse(this.horarioService.create(horario));
    }
  }

  trackTallerById(index: number, item: ITaller): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHorario>>): void {
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

  protected updateForm(horario: IHorario): void {
    this.editForm.patchValue({
      id: horario.id,
      diaSemana: horario.diaSemana,
      horaInicioTaller: horario.horaInicioTaller,
      taller: horario.taller,
    });

    this.tallersSharedCollection = this.tallerService.addTallerToCollectionIfMissing(this.tallersSharedCollection, horario.taller);
  }

  protected loadRelationshipsOptions(): void {
    this.tallerService
      .query()
      .pipe(map((res: HttpResponse<ITaller[]>) => res.body ?? []))
      .pipe(map((tallers: ITaller[]) => this.tallerService.addTallerToCollectionIfMissing(tallers, this.editForm.get('taller')!.value)))
      .subscribe((tallers: ITaller[]) => (this.tallersSharedCollection = tallers));
  }

  protected createFromForm(): IHorario {
    return {
      ...new Horario(),
      id: this.editForm.get(['id'])!.value,
      diaSemana: this.editForm.get(['diaSemana'])!.value,
      horaInicioTaller: this.editForm.get(['horaInicioTaller'])!.value,
      taller: this.editForm.get(['taller'])!.value,
    };
  }
}
