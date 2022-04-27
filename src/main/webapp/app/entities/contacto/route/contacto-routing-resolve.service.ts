import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IContacto, Contacto } from '../contacto.model';
import { ContactoService } from '../service/contacto.service';

@Injectable({ providedIn: 'root' })
export class ContactoRoutingResolveService implements Resolve<IContacto> {
  constructor(protected service: ContactoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IContacto> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((contacto: HttpResponse<Contacto>) => {
          if (contacto.body) {
            return of(contacto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Contacto());
  }
}
