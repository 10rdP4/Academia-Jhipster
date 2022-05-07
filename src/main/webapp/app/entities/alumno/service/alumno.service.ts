import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAlumno, getAlumnoIdentifier } from '../alumno.model';

export type EntityResponseType = HttpResponse<IAlumno>;
export type EntityArrayResponseType = HttpResponse<IAlumno[]>;

@Injectable({ providedIn: 'root' })
export class AlumnoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/alumnos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(alumno: IAlumno): Observable<EntityResponseType> {
    return this.http.post<IAlumno>(this.resourceUrl, alumno, { observe: 'response' });
  }

  update(alumno: IAlumno): Observable<EntityResponseType> {
    return this.http.put<IAlumno>(`${this.resourceUrl}/${getAlumnoIdentifier(alumno) as number}`, alumno, { observe: 'response' });
  }

  partialUpdate(alumno: IAlumno): Observable<EntityResponseType> {
    return this.http.patch<IAlumno>(`${this.resourceUrl}/${getAlumnoIdentifier(alumno) as number}`, alumno, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAlumno>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAlumno[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  buscarAlumno(busqueda:string): Observable<EntityArrayResponseType>{
    return this.http.get<IAlumno[]>(`${this.resourceUrl}/busqueda/${busqueda}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAlumnoToCollectionIfMissing(alumnoCollection: IAlumno[], ...alumnosToCheck: (IAlumno | null | undefined)[]): IAlumno[] {
    const alumnos: IAlumno[] = alumnosToCheck.filter(isPresent);
    if (alumnos.length > 0) {
      const alumnoCollectionIdentifiers = alumnoCollection.map(alumnoItem => getAlumnoIdentifier(alumnoItem)!);
      const alumnosToAdd = alumnos.filter(alumnoItem => {
        const alumnoIdentifier = getAlumnoIdentifier(alumnoItem);
        if (alumnoIdentifier == null || alumnoCollectionIdentifiers.includes(alumnoIdentifier)) {
          return false;
        }
        alumnoCollectionIdentifiers.push(alumnoIdentifier);
        return true;
      });
      return [...alumnosToAdd, ...alumnoCollection];
    }
    return alumnoCollection;
  }
}
