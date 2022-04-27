import dayjs from 'dayjs/esm';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { ITaller } from 'app/entities/taller/taller.model';

export interface IAsistencia {
  id?: number;
  fecha?: dayjs.Dayjs;
  asistencia?: boolean | null;
  alumno?: IAlumno | null;
  taller?: ITaller | null;
}

export class Asistencia implements IAsistencia {
  constructor(
    public id?: number,
    public fecha?: dayjs.Dayjs,
    public asistencia?: boolean | null,
    public alumno?: IAlumno | null,
    public taller?: ITaller | null
  ) {
    this.asistencia = this.asistencia ?? false;
  }
}

export function getAsistenciaIdentifier(asistencia: IAsistencia): number | undefined {
  return asistencia.id;
}
