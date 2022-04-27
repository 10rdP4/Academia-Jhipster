import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISuscripcion, Suscripcion } from '../suscripcion.model';
import { SuscripcionService } from '../service/suscripcion.service';

@Injectable({ providedIn: 'root' })
export class SuscripcionRoutingResolveService implements Resolve<ISuscripcion> {
  constructor(protected service: SuscripcionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISuscripcion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((suscripcion: HttpResponse<Suscripcion>) => {
          if (suscripcion.body) {
            return of(suscripcion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Suscripcion());
  }
}
