import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContacto, getContactoIdentifier } from '../contacto.model';

export type EntityResponseType = HttpResponse<IContacto>;
export type EntityArrayResponseType = HttpResponse<IContacto[]>;

@Injectable({ providedIn: 'root' })
export class ContactoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contactos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(contacto: IContacto): Observable<EntityResponseType> {
    return this.http.post<IContacto>(this.resourceUrl, contacto, { observe: 'response' });
  }

  update(contacto: IContacto): Observable<EntityResponseType> {
    return this.http.put<IContacto>(`${this.resourceUrl}/${getContactoIdentifier(contacto) as number}`, contacto, { observe: 'response' });
  }

  partialUpdate(contacto: IContacto): Observable<EntityResponseType> {
    return this.http.patch<IContacto>(`${this.resourceUrl}/${getContactoIdentifier(contacto) as number}`, contacto, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContacto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContacto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addContactoToCollectionIfMissing(contactoCollection: IContacto[], ...contactosToCheck: (IContacto | null | undefined)[]): IContacto[] {
    const contactos: IContacto[] = contactosToCheck.filter(isPresent);
    if (contactos.length > 0) {
      const contactoCollectionIdentifiers = contactoCollection.map(contactoItem => getContactoIdentifier(contactoItem)!);
      const contactosToAdd = contactos.filter(contactoItem => {
        const contactoIdentifier = getContactoIdentifier(contactoItem);
        if (contactoIdentifier == null || contactoCollectionIdentifiers.includes(contactoIdentifier)) {
          return false;
        }
        contactoCollectionIdentifiers.push(contactoIdentifier);
        return true;
      });
      return [...contactosToAdd, ...contactoCollection];
    }
    return contactoCollection;
  }
}
