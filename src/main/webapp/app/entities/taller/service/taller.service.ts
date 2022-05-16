import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITaller, getTallerIdentifier } from '../taller.model';

export type EntityResponseType = HttpResponse<ITaller>;
export type EntityArrayResponseType = HttpResponse<ITaller[]>;

@Injectable({ providedIn: 'root' })
export class TallerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tallers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(taller: ITaller): Observable<EntityResponseType> {
    return this.http.post<ITaller>(this.resourceUrl, taller, { observe: 'response' });
  }

  update(taller: ITaller): Observable<EntityResponseType> {
    return this.http.put<ITaller>(`${this.resourceUrl}/${getTallerIdentifier(taller) as number}`, taller, { observe: 'response' });
  }

  partialUpdate(taller: ITaller): Observable<EntityResponseType> {
    return this.http.patch<ITaller>(`${this.resourceUrl}/${getTallerIdentifier(taller) as number}`, taller, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITaller>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByNombre(nombre:string): Observable<EntityArrayResponseType>{
    return this.http.get<ITaller[]>(`${this.resourceUrl}/buscar/${nombre}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaller[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTallerToCollectionIfMissing(tallerCollection: ITaller[], ...tallersToCheck: (ITaller | null | undefined)[]): ITaller[] {
    const tallers: ITaller[] = tallersToCheck.filter(isPresent);
    if (tallers.length > 0) {
      const tallerCollectionIdentifiers = tallerCollection.map(tallerItem => getTallerIdentifier(tallerItem)!);
      const tallersToAdd = tallers.filter(tallerItem => {
        const tallerIdentifier = getTallerIdentifier(tallerItem);
        if (tallerIdentifier == null || tallerCollectionIdentifiers.includes(tallerIdentifier)) {
          return false;
        }
        tallerCollectionIdentifiers.push(tallerIdentifier);
        return true;
      });
      return [...tallersToAdd, ...tallerCollection];
    }
    return tallerCollection;
  }
}
