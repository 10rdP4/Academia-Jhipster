import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IAlumno } from 'app/entities/alumno/alumno.model';
import { AlumnoService } from 'app/entities/alumno/service/alumno.service';
import { IContacto } from 'app/entities/contacto/contacto.model';
import { ContactoService } from 'app/entities/contacto/service/contacto.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';
import { TallerService } from 'app/entities/taller/service/taller.service';
import { ITaller } from 'app/entities/taller/taller.model';
import dayjs from 'dayjs/esm';
import { FormularioSuscripcionService } from './formulario-suscripcion.service';
import { ResumenSuscripcionModalComponent } from './resumen-suscripcion-modal/resumen-suscripcion-modal.component';

@Component({
  selector: 'jhi-formulario-suscripcion',
  templateUrl: './formulario-suscripcion.component.html',
  styleUrls: ['./formulario-suscripcion.component.scss'],
})
export class FormularioSuscripcionComponent implements OnInit {
  titulo = '';

  // alumno
  nombre_alumno = '';
  apellido_alumno = '';
  dni_alumno = '';

  // contacto
  nombre_contacto = '';
  dni_contacto = '';
  telefono_contacto = '';
  correo_contacto = '';

  // taller
  talleres_disponibles: ITaller[] = [];
  taller_seleccionado?: ITaller = undefined;

  // error al rellenar formulario
  error = false;
  lista_errores: string[] = [];

  // Registrados
  alumno_registrado = false;
  contacto_registrado = false;

  // Guardar ya registrados
  alumno_busqueda = '';
  alumnos_registrados: IAlumno[] = [];
  alumno_seleccionado?: IAlumno = undefined;
  contacto_busqueda = '';
  contactos_registrados: IContacto[] = [];
  contacto_seleccionado?: IContacto = undefined;

  constructor(
    public tallerService: TallerService,
    public horarioService: HorarioService,
    public alumnoService: AlumnoService,
    public contactoService: ContactoService,
    public formularioSuscripcionService: FormularioSuscripcionService,
    private modalService: NgbModal) {
    this.loadTalleres();
  }

  ngOnInit(): void {
    this.titulo = '';
  }

  loadTalleres(): void {
    this.tallerService
      .query({
        size: 50,
      })
      .subscribe({
        next: (res: HttpResponse<ITaller[]>) => {
          this.talleres_disponibles = res.body ?? [];
          this.talleres_disponibles.sort((a, b) => (a.nombre! > b.nombre!) ? 1 : -1);
        },
      });
  }

  seleccionarTaller(taller: ITaller): void {
    this.taller_seleccionado = taller;

    // Cargamos los horarios de ese taller
    this.horarioService.findHorarioByTaller(this.taller_seleccionado.id!).subscribe({
      next: (res: HttpResponse<IHorario[]>) => {
        this.taller_seleccionado!.horarios = res.body ?? [];
      },
    });
  }

  formatoHorario(horario: IHorario): string {
    const semana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const dia_semana = semana[horario.diaSemana!];
    return `${dia_semana} - ${horario.horaInicioTaller!}`;
  }

  vaciarCampos(): void {
    this.nombre_alumno = '';
    this.apellido_alumno = '';
    this.dni_alumno = '';
    this.nombre_contacto = '';
    this.dni_contacto = '';
    this.telefono_contacto = '';
    this.correo_contacto = '';
    this.taller_seleccionado = undefined;
  }

  resumenSuscripcion(): void {
    if (!this.comprobacionErrores()) {
      this.cargaDatos();
      const modalRef = this.modalService.open(ResumenSuscripcionModalComponent);
      modalRef.componentInstance.crear_alumno = !this.alumno_registrado;
      modalRef.componentInstance.crear_contacto = !this.contacto_registrado;
    }
  }

  comprobacionErrores(): boolean {
    this.lista_errores = [];

    if (!this.alumno_registrado) {
      if (this.nombre_alumno === '') {
        this.lista_errores.push("Nombre del alumno no puede estar vacio")
      }
      if (this.apellido_alumno === '') {
        this.lista_errores.push("Apellido del alumno no puede estar vacio")
      }
      if (this.dni_alumno === '') {
        this.lista_errores.push("DNI del alumno no puede estar vacio")
      }

      // Validaciones Creacion Contacto
      if (!this.contacto_registrado) {
        if (this.nombre_contacto === '') {
          this.lista_errores.push("Nombre del contacto no puede estar vacio")
        }

        if (this.dni_contacto === '') {
          this.lista_errores.push("DNI del contacto no puede estar vacio")
        }

        if (this.telefono_contacto.length !== 9 && this.telefono_contacto.length > 0) {
          this.lista_errores.push("Telefono Incorrecto")
        }

        if (this.telefono_contacto === '' && this.correo_contacto === '') {
          this.lista_errores.push("Al menos hay que facilitar un correo o un telefono de contacto")
        }
      } else {
        if (this.contacto_seleccionado === undefined) {
          this.lista_errores.push("Es necesario seleccionar un contacto")
        }
      }
      // Fin Validaciones Creacion contacto

    } else {
      if (this.alumno_seleccionado === undefined) {
        this.lista_errores.push("Es necesario seleccionar un alumno")
      }
    }

    if (this.taller_seleccionado === undefined) {
      this.lista_errores.push("No se ha seleccionado ningún taller");
    }

    return (this.error = this.lista_errores.length > 0);
  }

  cargaDatos(): void {

    if (!this.alumno_registrado) {
      this.formularioSuscripcionService.setAlumno({
        nombre:this.nombre_alumno,
        apellido:this.apellido_alumno,
        dni: this.dni_alumno
      });

      if (!this.contacto_registrado) {
        this.formularioSuscripcionService.setContactoAlumno({
          nombre: this.nombre_contacto,
          dni: this.dni_contacto,
          telefono: this.telefono_contacto,
          correo: this.correo_contacto
        })
      } else {
        this.formularioSuscripcionService.setContactoAlumno(this.contacto_seleccionado!);
      }

    } else {
      this.formularioSuscripcionService.setAlumno(this.alumno_seleccionado!);
    }

    this.formularioSuscripcionService.setTaller(this.taller_seleccionado!);
    this.formularioSuscripcionService.setFecha(dayjs());
  }

  changeAlumnoRegistrado(registrado: boolean): void {
    this.alumno_registrado = registrado;
  }
  changeContactoRegistrado(registrado: boolean): void {
    this.contacto_registrado = registrado;
  }

  buscarAlumno(): void {
    this.alumnoService.buscarAlumno(this.alumno_busqueda).subscribe({
      next: (res: HttpResponse<IAlumno[]>) => {
        this.alumnos_registrados = res.body ?? [];
      },
      error: () => {
        this.alumnos_registrados = [];
      }
    });
  }

  buscarContacto(): void {
    this.contactoService.buscarContacto(this.contacto_busqueda).subscribe({
      next: (res: HttpResponse<IContacto[]>) => {
        this.contactos_registrados = res.body ?? [];
      },
      error: () => {
        this.contactos_registrados = [];
      }
    });
  }

  seleccionarAlumnoExistente(alumno: IAlumno): void {
    this.alumno_seleccionado = alumno;
  }

  seleccionarContactoExistente(contacto: IContacto): void {
    this.contacto_seleccionado = contacto;
  }
}
