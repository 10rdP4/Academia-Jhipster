import dayjs from 'dayjs/esm';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { ITaller } from 'app/entities/taller/taller.model';

export interface ISuscripcion {
  id?: number;
  fecha?: dayjs.Dayjs;
  activa?: boolean | null;
  alumno?: IAlumno | null;
  taller?: ITaller | null;
}

export class Suscripcion implements ISuscripcion {
  constructor(
    public id?: number,
    public fecha?: dayjs.Dayjs,
    public activa?: boolean | null,
    public alumno?: IAlumno | null,
    public taller?: ITaller | null
  ) {
    this.activa = this.activa ?? false;
  }
}

export function getSuscripcionIdentifier(suscripcion: ISuscripcion): number | undefined {
  return suscripcion.id;
}
