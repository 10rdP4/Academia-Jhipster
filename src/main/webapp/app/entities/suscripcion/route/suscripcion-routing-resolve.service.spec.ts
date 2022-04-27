import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISuscripcion, Suscripcion } from '../suscripcion.model';
import { SuscripcionService } from '../service/suscripcion.service';

import { SuscripcionRoutingResolveService } from './suscripcion-routing-resolve.service';

describe('Suscripcion routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SuscripcionRoutingResolveService;
  let service: SuscripcionService;
  let resultSuscripcion: ISuscripcion | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(SuscripcionRoutingResolveService);
    service = TestBed.inject(SuscripcionService);
    resultSuscripcion = undefined;
  });

  describe('resolve', () => {
    it('should return ISuscripcion returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSuscripcion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSuscripcion).toEqual({ id: 123 });
    });

    it('should return new ISuscripcion if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSuscripcion = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSuscripcion).toEqual(new Suscripcion());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Suscripcion })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSuscripcion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSuscripcion).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
