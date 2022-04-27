import { ITaller } from 'app/entities/taller/taller.model';

export interface IHorario {
  id?: number;
  diaSemana?: number;
  horaInicioTaller?: string | null;
  taller?: ITaller | null;
}

export class Horario implements IHorario {
  constructor(public id?: number, public diaSemana?: number, public horaInicioTaller?: string | null, public taller?: ITaller | null) {}
}

export function getHorarioIdentifier(horario: IHorario): number | undefined {
  return horario.id;
}
