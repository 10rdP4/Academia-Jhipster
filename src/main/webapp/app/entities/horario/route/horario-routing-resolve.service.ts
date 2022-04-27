import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHorario, Horario } from '../horario.model';
import { HorarioService } from '../service/horario.service';

@Injectable({ providedIn: 'root' })
export class HorarioRoutingResolveService implements Resolve<IHorario> {
  constructor(protected service: HorarioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHorario> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((horario: HttpResponse<Horario>) => {
          if (horario.body) {
            return of(horario.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Horario());
  }
}
