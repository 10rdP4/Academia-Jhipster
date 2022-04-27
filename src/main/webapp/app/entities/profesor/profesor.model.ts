import { ITaller } from 'app/entities/taller/taller.model';

export interface IProfesor {
  id?: number;
  nombre?: string;
  apellido?: string | null;
  sueldo?: number;
  tallers?: ITaller[] | null;
}

export class Profesor implements IProfesor {
  constructor(
    public id?: number,
    public nombre?: string,
    public apellido?: string | null,
    public sueldo?: number,
    public tallers?: ITaller[] | null
  ) {}
}

export function getProfesorIdentifier(profesor: IProfesor): number | undefined {
  return profesor.id;
}
