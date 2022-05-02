import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISuscripcion, getSuscripcionIdentifier } from '../suscripcion.model';

export type EntityResponseType = HttpResponse<ISuscripcion>;
export type EntityArrayResponseType = HttpResponse<ISuscripcion[]>;

@Injectable({ providedIn: 'root' })
export class SuscripcionService {

  /*
  En esta suscripcion guardo los cambios que se vayan haciendo en el formulario
  Es una suscripcion "carrito"
  */
  nuevaSuscripcion:ISuscripcion = {}

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/suscripcions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(suscripcion: ISuscripcion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(suscripcion);
    return this.http
      .post<ISuscripcion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(suscripcion: ISuscripcion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(suscripcion);
    return this.http
      .put<ISuscripcion>(`${this.resourceUrl}/${getSuscripcionIdentifier(suscripcion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(suscripcion: ISuscripcion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(suscripcion);
    return this.http
      .patch<ISuscripcion>(`${this.resourceUrl}/${getSuscripcionIdentifier(suscripcion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISuscripcion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISuscripcion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSuscripcionToCollectionIfMissing(
    suscripcionCollection: ISuscripcion[],
    ...suscripcionsToCheck: (ISuscripcion | null | undefined)[]
  ): ISuscripcion[] {
    const suscripcions: ISuscripcion[] = suscripcionsToCheck.filter(isPresent);
    if (suscripcions.length > 0) {
      const suscripcionCollectionIdentifiers = suscripcionCollection.map(suscripcionItem => getSuscripcionIdentifier(suscripcionItem)!);
      const suscripcionsToAdd = suscripcions.filter(suscripcionItem => {
        const suscripcionIdentifier = getSuscripcionIdentifier(suscripcionItem);
        if (suscripcionIdentifier == null || suscripcionCollectionIdentifiers.includes(suscripcionIdentifier)) {
          return false;
        }
        suscripcionCollectionIdentifiers.push(suscripcionIdentifier);
        return true;
      });
      return [...suscripcionsToAdd, ...suscripcionCollection];
    }
    return suscripcionCollection;
  }

  protected convertDateFromClient(suscripcion: ISuscripcion): ISuscripcion {
    return Object.assign({}, suscripcion, {
      fecha: suscripcion.fecha?.isValid() ? suscripcion.fecha.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha ? dayjs(res.body.fecha) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((suscripcion: ISuscripcion) => {
        suscripcion.fecha = suscripcion.fecha ? dayjs(suscripcion.fecha) : undefined;
      });
    }
    return res;
  }
}
