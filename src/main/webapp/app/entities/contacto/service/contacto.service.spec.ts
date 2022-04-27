import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IContacto, Contacto } from '../contacto.model';

import { ContactoService } from './contacto.service';

describe('Contacto Service', () => {
  let service: ContactoService;
  let httpMock: HttpTestingController;
  let elemDefault: IContacto;
  let expectedResult: IContacto | IContacto[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ContactoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombre: 'AAAAAAA',
      telefono: 'AAAAAAA',
      correo: 'AAAAAAA',
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

    it('should create a Contacto', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Contacto()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Contacto', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          telefono: 'BBBBBB',
          correo: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Contacto', () => {
      const patchObject = Object.assign(
        {
          nombre: 'BBBBBB',
          correo: 'BBBBBB',
        },
        new Contacto()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Contacto', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombre: 'BBBBBB',
          telefono: 'BBBBBB',
          correo: 'BBBBBB',
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

    it('should delete a Contacto', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addContactoToCollectionIfMissing', () => {
      it('should add a Contacto to an empty array', () => {
        const contacto: IContacto = { id: 123 };
        expectedResult = service.addContactoToCollectionIfMissing([], contacto);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contacto);
      });

      it('should not add a Contacto to an array that contains it', () => {
        const contacto: IContacto = { id: 123 };
        const contactoCollection: IContacto[] = [
          {
            ...contacto,
          },
          { id: 456 },
        ];
        expectedResult = service.addContactoToCollectionIfMissing(contactoCollection, contacto);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Contacto to an array that doesn't contain it", () => {
        const contacto: IContacto = { id: 123 };
        const contactoCollection: IContacto[] = [{ id: 456 }];
        expectedResult = service.addContactoToCollectionIfMissing(contactoCollection, contacto);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contacto);
      });

      it('should add only unique Contacto to an array', () => {
        const contactoArray: IContacto[] = [{ id: 123 }, { id: 456 }, { id: 7182 }];
        const contactoCollection: IContacto[] = [{ id: 123 }];
        expectedResult = service.addContactoToCollectionIfMissing(contactoCollection, ...contactoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const contacto: IContacto = { id: 123 };
        const contacto2: IContacto = { id: 456 };
        expectedResult = service.addContactoToCollectionIfMissing([], contacto, contacto2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contacto);
        expect(expectedResult).toContain(contacto2);
      });

      it('should accept null and undefined values', () => {
        const contacto: IContacto = { id: 123 };
        expectedResult = service.addContactoToCollectionIfMissing([], null, contacto, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contacto);
      });

      it('should return initial array if no Contacto is added', () => {
        const contactoCollection: IContacto[] = [{ id: 123 }];
        expectedResult = service.addContactoToCollectionIfMissing(contactoCollection, undefined, null);
        expect(expectedResult).toEqual(contactoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
