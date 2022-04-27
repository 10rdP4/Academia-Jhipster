import { ISuscripcion } from 'app/entities/suscripcion/suscripcion.model';
import { IAsistencia } from 'app/entities/asistencia/asistencia.model';
import { IContacto } from 'app/entities/contacto/contacto.model';

export interface IAlumno {
  id?: number;
  nombre?: string;
  apellido?: string | null;
  suscripcions?: ISuscripcion[] | null;
  asistencias?: IAsistencia[] | null;
  contacto?: IContacto | null;
}

export class Alumno implements IAlumno {
  constructor(
    public id?: number,
    public nombre?: string,
    public apellido?: string | null,
    public suscripcions?: ISuscripcion[] | null,
    public asistencias?: IAsistencia[] | null,
    public contacto?: IContacto | null
  ) {}
}

export function getAlumnoIdentifier(alumno: IAlumno): number | undefined {
  return alumno.id;
}
