import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAsistencia, Asistencia } from '../asistencia.model';
import { AsistenciaService } from '../service/asistencia.service';

@Injectable({ providedIn: 'root' })
export class AsistenciaRoutingResolveService implements Resolve<IAsistencia> {
  constructor(protected service: AsistenciaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAsistencia> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((asistencia: HttpResponse<Asistencia>) => {
          if (asistencia.body) {
            return of(asistencia.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Asistencia());
  }
}
