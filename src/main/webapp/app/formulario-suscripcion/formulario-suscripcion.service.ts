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
    nuevaSuscripcion: ISuscripcion = {
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

    setNombreAlumno(nombre: string): void {
        this.alumno.nombre = nombre;
    }
    setApellidoAlumno(apellido: string): void {
        this.alumno.apellido = apellido;
    }
    setDniAlumno(dni:string):void{
        this.alumno.dni = dni;
    }
    setNombreContacto(nombre: string): void {
        this.contacto.nombre = nombre;
    }
    setDniContacto(dni:string):void{
        this.contacto.dni = dni;
    }
    setTelefonoContacto(telefono: string): void {
        this.contacto.telefono = telefono;
    }
    setCorreoContacto(correo: string): void {
        this.contacto.correo = correo;
    }
    setTaller(taller: ITaller): void {
        this.nuevaSuscripcion.taller = taller;
    }
    setFecha(fecha: Dayjs):void{
        this.nuevaSuscripcion.fecha = fecha;
    }
    setAlumno(alumno:IAlumno):void{
        this.nuevaSuscripcion.alumno = alumno;
    }
    setContactoAlumno(contacto:IContacto):void{
        this.alumno.contacto = contacto;
    }
}