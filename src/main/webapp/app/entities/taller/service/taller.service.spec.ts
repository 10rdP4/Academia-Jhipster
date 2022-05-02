import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITaller, Taller } from '../taller.model';

import { TallerService } from './taller.service';

describe('Taller Service', () => {
  let service: TallerService;
  let httpMock: HttpTestingController;
  let elemDefault: ITaller;
  let expectedResult: ITaller | ITaller[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TallerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombre: 'AAAAAAA',
      precio: 0,
      descripcion: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Taller', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Taller()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Taller', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          precio: 1,
          descripcion: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Taller', () => {
      const patchObject = Object.assign(
        {
          descripcion: 'BBBBBB',
        },
        new Taller()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Taller', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          precio: 1,
          descripcion: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Taller', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTallerToCollectionIfMissing', () => {
      it('should add a Taller to an empty array', () => {
        const taller: ITaller = { id: 123 };
        expectedResult = service.addTallerToCollectionIfMissing([], taller);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(taller);
      });

      it('should not add a Taller to an array that contains it', () => {
        const taller: ITaller = { id: 123 };
        const tallerCollection: ITaller[] = [
          {
            ...taller,
          },
          { id: 456 },
        ];
        expectedResult = service.addTallerToCollectionIfMissing(tallerCollection, taller);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Taller to an array that doesn't contain it", () => {
        const taller: ITaller = { id: 123 };
        const tallerCollection: ITaller[] = [{ id: 456 }];
        expectedResult = service.addTallerToCollectionIfMissing(tallerCollection, taller);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(taller);
      });

      it('should add only unique Taller to an array', () => {
        const tallerArray: ITaller[] = [{ id: 123 }, { id: 456 }, { id: 38247 }];
        const tallerCollection: ITaller[] = [{ id: 123 }];
        expectedResult = service.addTallerToCollectionIfMissing(tallerCollection, ...tallerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const taller: ITaller = { id: 123 };
        const taller2: ITaller = { id: 456 };
        expectedResult = service.addTallerToCollectionIfMissing([], taller, taller2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(taller);
        expect(expectedResult).toContain(taller2);
      });

      it('should accept null and undefined values', () => {
        const taller: ITaller = { id: 123 };
        expectedResult = service.addTallerToCollectionIfMissing([], null, taller, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(taller);
      });

      it('should return initial array if no Taller is added', () => {
        const tallerCollection: ITaller[] = [{ id: 123 }];
        expectedResult = service.addTallerToCollectionIfMissing(tallerCollection, undefined, null);
        expect(expectedResult).toEqual(tallerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
