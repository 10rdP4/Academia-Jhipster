import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITaller, Taller } from '../taller.model';
import { TallerService } from '../service/taller.service';

@Injectable({ providedIn: 'root' })
export class TallerRoutingResolveService implements Resolve<ITaller> {
  constructor(protected service: TallerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITaller> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((taller: HttpResponse<Taller>) => {
          if (taller.body) {
            return of(taller.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Taller());
  }
}
