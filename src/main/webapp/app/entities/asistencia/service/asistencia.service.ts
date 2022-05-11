import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAsistencia, getAsistenciaIdentifier } from '../asistencia.model';

export type EntityResponseType = HttpResponse<IAsistencia>;
export type EntityArrayResponseType = HttpResponse<IAsistencia[]>;

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/asistencias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(asistencia: IAsistencia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(asistencia);
    return this.http
      .post<IAsistencia>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(asistencia: IAsistencia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(asistencia);
    return this.http
      .put<IAsistencia>(`${this.resourceUrl}/${getAsistenciaIdentifier(asistencia) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(asistencia: IAsistencia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(asistencia);
    return this.http
      .patch<IAsistencia>(`${this.resourceUrl}/${getAsistenciaIdentifier(asistencia) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAsistencia>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  buscarPorFechaTaller(fecha:string, taller_id:number): Observable<EntityArrayResponseType> {
    return this.http
      .get<IAsistencia[]>(`${this.resourceUrl}/taller/${taller_id}/${fecha}`, {observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAsistencia[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAsistenciaToCollectionIfMissing(
    asistenciaCollection: IAsistencia[],
    ...asistenciasToCheck: (IAsistencia | null | undefined)[]
  ): IAsistencia[] {
    const asistencias: IAsistencia[] = asistenciasToCheck.filter(isPresent);
    if (asistencias.length > 0) {
      const asistenciaCollectionIdentifiers = asistenciaCollection.map(asistenciaItem => getAsistenciaIdentifier(asistenciaItem)!);
      const asistenciasToAdd = asistencias.filter(asistenciaItem => {
        const asistenciaIdentifier = getAsistenciaIdentifier(asistenciaItem);
        if (asistenciaIdentifier == null || asistenciaCollectionIdentifiers.includes(asistenciaIdentifier)) {
          return false;
        }
        asistenciaCollectionIdentifiers.push(asistenciaIdentifier);
        return true;
      });
      return [...asistenciasToAdd, ...asistenciaCollection];
    }
    return asistenciaCollection;
  }

  protected convertDateFromClient(asistencia: IAsistencia): IAsistencia {
    return Object.assign({}, asistencia, {
      fecha: asistencia.fecha?.isValid() ? asistencia.fecha.toJSON() : undefined,
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
      res.body.forEach((asistencia: IAsistencia) => {
        asistencia.fecha = asistencia.fecha ? dayjs(asistencia.fecha) : undefined;
      });
    }
    return res;
  }
}
