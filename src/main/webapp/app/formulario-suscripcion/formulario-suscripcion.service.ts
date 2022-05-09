import { Injectable } from "@angular/core";
import { IAlumno } from "app/entities/alumno/alumno.model";
import { IContacto } from "app/entities/contacto/contacto.model";
import { ISuscripcion } from "app/entities/suscripcion/suscripcion.model";
import { ITaller } from "app/entities/taller/taller.model";
import { Dayjs } from "dayjs/esm";


@Injectable({ providedIn: 'root' })
export class FormularioSuscripcionService {
    title = ''
    /*
  En esta suscripcion guardo los cambios que se vayan haciendo en el formulario
  Es una suscripcion "carrito"
  */
    nuevaSuscripcion:ISuscripcion = {
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
    setFecha(fecha: Dayjs):void{
        this.nuevaSuscripcion.fecha = fecha;
    }

    // Suscripcion
    setAlumno(alumno:IAlumno):void{
        this.nuevaSuscripcion.alumno = alumno;
    }
    setContactoAlumno(contacto:IContacto):void{
        this.nuevaSuscripcion.alumno!.contacto = contacto;
    }
}