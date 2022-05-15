import { Injectable } from "@angular/core";
import { IAlumno } from "app/entities/alumno/alumno.model";
import { IContacto } from "app/entities/contacto/contacto.model";
import { ISuscripcion } from "app/entities/suscripcion/suscripcion.model";
import { ITaller } from "app/entities/taller/taller.model";
import { Dayjs } from "dayjs/esm";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Injectable({ providedIn: 'root' })
export class FormularioSuscripcionService {
    title = ''
    /*
  En esta suscripcion guardo los cambios que se vayan haciendo en el formulario
  Es una suscripcion "carrito"
  */
    nuevaSuscripcion: ISuscripcion = {
        alumno: {
            contacto: {}
        },
        activa: true,
        taller: {},
    }
    alumno: IAlumno = {
        nombre: '',
        apellido: '',
        dni: '',
        contacto: {}
    }
    contacto: IContacto = {
        nombre: '',
        dni: '',
        telefono: '',
        correo: ''
    }

    constructor() {
        this.title = ''
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
                title: `${this.nuevaSuscripcion.alumno!.nombre!}_${this.nuevaSuscripcion.taller!.nombre!}_${this.nuevaSuscripcion.fecha!.toString()}.pdf`,
                author: 'Academia Lovelace',
            },
            content: [
                {
                    style: 'header',
                    text: 'Lovelace Academia'
                    
                },
                {
                    style: 'subheader',
                    text: 'Datos del Alumno'
                    
                },
                {
                    style: 'subheader',
                    text: 'Datos del Contacto'
                    
                },
                {
                    style: 'subheader',
                    text: 'Datos del Taller'
                    
                },
                {
                    style: 'subheader',
                    text: 'Precio'
                    
                }
            ],
            style: {
                header: {
                    fontSize: 18,
                    bold: true,
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                },
            }

        }

        const pdf_resultado = pdfMake.createPdf(pdf_suscripcion);
        pdf_resultado.open();
    }
}