import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfesor, getProfesorIdentifier } from '../profesor.model';

export type EntityResponseType = HttpResponse<IProfesor>;
export type EntityArrayResponseType = HttpResponse<IProfesor[]>;

@Injectable({ providedIn: 'root' })
export class ProfesorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/profesors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(profesor: IProfesor): Observable<EntityResponseType> {
    return this.http.post<IProfesor>(this.resourceUrl, profesor, { observe: 'response' });
  }

  update(profesor: IProfesor): Observable<EntityResponseType> {
    return this.http.put<IProfesor>(`${this.resourceUrl}/${getProfesorIdentifier(profesor) as number}`, profesor, { observe: 'response' });
  }

  partialUpdate(profesor: IProfesor): Observable<EntityResponseType> {
    return this.http.patch<IProfesor>(`${this.resourceUrl}/${getProfesorIdentifier(profesor) as number}`, profesor, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProfesor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findProfesorByDni(dni:string): Observable<EntityArrayResponseType>{
    return this.http.get<IProfesor[]>(`${this.resourceUrl}/buscar/${dni}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfesor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProfesorToCollectionIfMissing(profesorCollection: IProfesor[], ...profesorsToCheck: (IProfesor | null | undefined)[]): IProfesor[] {
    const profesors: IProfesor[] = profesorsToCheck.filter(isPresent);
    if (profesors.length > 0) {
      const profesorCollectionIdentifiers = profesorCollection.map(profesorItem => getProfesorIdentifier(profesorItem)!);
      const profesorsToAdd = profesors.filter(profesorItem => {
        const profesorIdentifier = getProfesorIdentifier(profesorItem);
        if (profesorIdentifier == null || profesorCollectionIdentifiers.includes(profesorIdentifier)) {
          return false;
        }
        profesorCollectionIdentifiers.push(profesorIdentifier);
        return true;
      });
      return [...profesorsToAdd, ...profesorCollection];
    }
    return profesorCollection;
  }
}
