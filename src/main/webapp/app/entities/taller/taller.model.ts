import { ISuscripcion } from 'app/entities/suscripcion/suscripcion.model';
import { IAsistencia } from 'app/entities/asistencia/asistencia.model';
import { IHorario } from 'app/entities/horario/horario.model';
import { IProfesor } from 'app/entities/profesor/profesor.model';

export interface ITaller {
  id?: number;
  nombre?: string;
  precio?: number;
  suscripcions?: ISuscripcion[] | null;
  asistencias?: IAsistencia[] | null;
  horarios?: IHorario[] | null;
  profesor?: IProfesor | null;
}

export class Taller implements ITaller {
  constructor(
    public id?: number,
    public nombre?: string,
    public precio?: number,
    public suscripcions?: ISuscripcion[] | null,
    public asistencias?: IAsistencia[] | null,
    public horarios?: IHorario[] | null,
    public profesor?: IProfesor | null
  ) {}
}

export function getTallerIdentifier(taller: ITaller): number | undefined {
  return taller.id;
}
