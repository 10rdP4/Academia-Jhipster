import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHorario, getHorarioIdentifier } from '../horario.model';

export type EntityResponseType = HttpResponse<IHorario>;
export type EntityArrayResponseType = HttpResponse<IHorario[]>;

@Injectable({ providedIn: 'root' })
export class HorarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/horarios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(horario: IHorario): Observable<EntityResponseType> {
    return this.http.post<IHorario>(this.resourceUrl, horario, { observe: 'response' });
  }

  update(horario: IHorario): Observable<EntityResponseType> {
    return this.http.put<IHorario>(`${this.resourceUrl}/${getHorarioIdentifier(horario) as number}`, horario, { observe: 'response' });
  }

  partialUpdate(horario: IHorario): Observable<EntityResponseType> {
    return this.http.patch<IHorario>(`${this.resourceUrl}/${getHorarioIdentifier(horario) as number}`, horario, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHorario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHorario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHorarioToCollectionIfMissing(horarioCollection: IHorario[], ...horariosToCheck: (IHorario | null | undefined)[]): IHorario[] {
    const horarios: IHorario[] = horariosToCheck.filter(isPresent);
    if (horarios.length > 0) {
      const horarioCollectionIdentifiers = horarioCollection.map(horarioItem => getHorarioIdentifier(horarioItem)!);
      const horariosToAdd = horarios.filter(horarioItem => {
        const horarioIdentifier = getHorarioIdentifier(horarioItem);
        if (horarioIdentifier == null || horarioCollectionIdentifiers.includes(horarioIdentifier)) {
          return false;
        }
        horarioCollectionIdentifiers.push(horarioIdentifier);
        return true;
      });
      return [...horariosToAdd, ...horarioCollection];
    }
    return horarioCollection;
  }
}
