import { IAlumno } from 'app/entities/alumno/alumno.model';

export interface IContacto {
  id?: number;
  nombre?: string;
  telefono?: string | null;
  correo?: string | null;
  dni?: string;
  alumnos?: IAlumno[] | null;
}

export class Contacto implements IContacto {
  constructor(
    public id?: number,
    public nombre?: string,
    public telefono?: string | null,
    public correo?: string | null,
    public dni?: string,
    public alumnos?: IAlumno[] | null
  ) {}
}

export function getContactoIdentifier(contacto: IContacto): number | undefined {
  return contacto.id;
}
