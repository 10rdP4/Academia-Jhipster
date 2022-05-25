import { Injectable } from '@angular/core';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { IContacto } from 'app/entities/contacto/contacto.model';
import { ISuscripcion } from 'app/entities/suscripcion/suscripcion.model';
import { ITaller } from 'app/entities/taller/taller.model';
import { Dayjs } from 'dayjs/esm';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({ providedIn: 'root' })
export class FormularioSuscripcionService {
  title = '';
  /*
  En esta suscripcion guardo los cambios que se vayan haciendo en el formulario
  Es una suscripcion "carrito"
  */
  nuevaSuscripcion: ISuscripcion = {
    alumno: {
      contacto: {},
    },
    activa: true,
    taller: {},
  };
  alumno: IAlumno = {
    nombre: '',
    apellido: '',
    dni: '',
    contacto: {},
  };
  contacto: IContacto = {
    nombre: '',
    dni: '',
    telefono: '',
    correo: '',
  };

  constructor() {
    this.title = '';
  }

  // Taller
  setTaller(taller: ITaller): void {
    this.nuevaSuscripcion.taller = taller;
  }

  // Fecha
  setFecha(fecha: Dayjs): void {
    this.nuevaSuscripcion.fecha = fecha;
  }

  // Suscripcion
  setAlumno(alumno: IAlumno): void {
    this.nuevaSuscripcion.alumno = alumno;
  }
  setContactoAlumno(contacto: IContacto): void {
    this.nuevaSuscripcion.alumno!.contacto = contacto;
  }

  crearPDFSuscripcion(): void {
    // Suscripcion en PDF
    const pdf_suscripcion: any = {
      info: {
        title: `${this.nuevaSuscripcion.alumno!.nombre!}_${this.nuevaSuscripcion.taller!
          .nombre!}_${this.nuevaSuscripcion.fecha!.toString()}.pdf`,
        author: 'Academia Turing',
      },
      content: [
        {
          style: 'header',
          text: 'Turing Academia',
          alignment: 'center',
        },
        {
          text: `\n================================================================\n\n`,
          alignment: 'center',
        },
        {
          style: 'postheader',
          text: 'Factura de nueva suscripcion\n\n',
        },
        {
          style: 'subheader',
          text: 'Datos del Alumno',
        },
        {
          type: 'circle',
          ul: [
            `Nombre: ${this.nuevaSuscripcion.alumno!.nombre!}`,
            `Apellido: ${this.nuevaSuscripcion.alumno!.apellido!}`,
            `DNI: ${this.nuevaSuscripcion.alumno!.dni!}`,
          ],
        },
        {
          style: 'subheader',
          text: '\nDatos del Contacto',
        },
        {
          type: 'circle',
          ul: [
            `Nombre: ${this.nuevaSuscripcion.alumno!.contacto!.nombre!}`,
            `DNI: ${this.nuevaSuscripcion.alumno!.contacto!.dni!}`,
            `Teléfono: ${this.nuevaSuscripcion.alumno!.contacto!.telefono!}`,
            `Correo: ${this.nuevaSuscripcion.alumno!.contacto!.correo!}`,
          ],
        },
        {
          style: 'subheader',
          text: '\nDatos del Taller',
        },
        {
          type: 'circle',
          ul: [
            `Nombre: ${this.nuevaSuscripcion.taller!.nombre!}`,
            `Descripcion: ${this.nuevaSuscripcion.taller!.descripcion!}`,
            `Profesor: ${this.nuevaSuscripcion.taller!.profesor!.nombre!} ${this.nuevaSuscripcion.taller!.profesor!.apellido!}`,
          ],
        },
        {
          text: `\n================================================================\n`,
          alignment: 'center',
        },
        {
          style: 'subheader',
          text: `\nPrecio: ${this.nuevaSuscripcion.taller!.precio!}€`,
        },
        {
          style: 'footer',
          text: `\nMuchas Gracias por su compra`,
        },
      ],
      styles: {
        header: {
          fontSize: 30,
          bold: true,
        },
        postheader: {
          fontSize: 18,
          bold: true,
          decoration: 'underline',
        },
        subheader: {
          fontSize: 15,
          bold: true,
        },
        footer: {
          fontSize: 12,
          italics: true,
          alignment: 'right',
        },
      },
    };

    const pdf_resultado = pdfMake.createPdf(pdf_suscripcion);
    pdf_resultado.open();
  }
}