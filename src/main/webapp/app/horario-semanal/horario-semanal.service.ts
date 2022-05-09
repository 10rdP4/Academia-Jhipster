import { Injectable } from '@angular/core';
import { IHorario } from 'app/entities/horario/horario.model';
import { ITaller } from 'app/entities/taller/taller.model';

@Injectable({ providedIn: 'root' })
export class HorarioSemanalService {
  title = '';

  // Taller para el modal Informacion
  taller: ITaller = {};
  horario_taller:IHorario[] = [];

  constructor() {
    this.title = '';
  }

  setTaller(taller:ITaller):void{
    this.taller = taller;
  }

  setHorarioTaller(horarios:IHorario[]):void{
    this.horario_taller = horarios;
  }
}
