import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IAsistencia } from 'app/entities/asistencia/asistencia.model';
import { AsistenciaService } from 'app/entities/asistencia/service/asistencia.service';
import { IHorario } from 'app/entities/horario/horario.model';
import { HorarioService } from 'app/entities/horario/service/horario.service';
import { SuscripcionService } from 'app/entities/suscripcion/service/suscripcion.service';
import { ISuscripcion } from 'app/entities/suscripcion/suscripcion.model';
import { TallerService } from 'app/entities/taller/service/taller.service';
import { ITaller } from 'app/entities/taller/taller.model';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-asistencias-talleres',
  templateUrl: './asistencias-talleres.component.html',
  styleUrls: ['./asistencias-talleres.component.scss'],
})
export class AsistenciasTalleresComponent implements OnInit {
  titulo = '';

  // Carga de datos
  talleres_disponibles: ITaller[] = [];
  horarios_taller: IHorario[] = [];
  suscripciones_taller: ISuscripcion[] = [];

  // Guardar Datos
  asistencias: IAsistencia[] = [];
  asistencias_suscripcion: IAsistencia[] = [];

  // Selecciones
  taller_seleccionado?: ITaller = undefined;
  horario_seleccionado?: IHorario = undefined;

  // Comprobacion asistencias
  taller_comprobacion_asistencias?: ITaller = undefined;
  model?: Date;
  lista_asistencias_comprobacion: IAsistencia[] = [];

  // Guardado Correctamente
  guardado = false;

  constructor(
    public tallerService: TallerService,
    public horarioService: HorarioService,
    public suscripcionService: SuscripcionService,
    public asistenciaService: AsistenciaService
  ) {
    this.titulo = '';
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
          this.talleres_disponibles.sort((a, b) => (a.nombre! > b.nombre! ? 1 : -1));
        },
      });
  }

  seleccionarTaller(taller: ITaller): void {
    this.taller_seleccionado = taller;
    // Cargar los horarios de ese taller
    this.cargaHorarios(taller);
    this.guardado = false;
  }

  seleccionarHorario(horario: IHorario): void {
    this.horario_seleccionado = horario;
    this.cargaAsistencias();
  }

  cargaHorarios(taller: ITaller): void {
    let dia = dayjs().day();
    dia = dia === 0 ? 6 : dia - 1;
    this.horarioService.findHorarioByTallerYDia(taller.id!, dia).subscribe({
      next: (res: HttpResponse<IHorario[]>) => {
        this.horarios_taller = res.body ?? [];

        this.horarios_taller.sort(function (a, b) {
          const hora_a = parseInt(a.horaInicioTaller!.split(':')[0], 10);
          const hora_b = parseInt(b.horaInicioTaller!.split(':')[0], 10);
          return hora_a - hora_b;
        });
      },
    });
  }

  cargaSuscripciones(taller: ITaller): void {
    this.suscripcionService.buscarSucripcionPorTaller(taller.id!).subscribe({
      next: (res: HttpResponse<ISuscripcion[]>) => {
        this.suscripciones_taller = res.body ?? [];
        this.crearAsistencias();

        this.asistencias_suscripcion.sort((a, b) => (a.alumno!.nombre! > b.alumno!.nombre! ? 1 : -1));
      },
    });
  }

  cargaAsistencias(): void {
    const hora_inicio = parseInt(this.horario_seleccionado!.horaInicioTaller!.split(':')[0], 10);
    const fecha = dayjs()
      .hour(hora_inicio - 2)
      .format('YYYY-MM-DD HH');
    this.asistenciaService.buscarPorFechaTaller(fecha, this.taller_seleccionado!.id!).subscribe({
      next: (res: HttpResponse<IAsistencia[]>) => {
        this.asistencias = res.body ?? [];

        if (this.asistencias.length <= 0) {
          this.cargaSuscripciones(this.taller_seleccionado!);
        } else {
          this.asistencias.sort((a, b) => (a.alumno!.nombre! > b.alumno!.nombre! ? 1 : -1));
        }
      },
    });
  }

  guardarAsistencias(): void {
    if (this.horario_seleccionado !== undefined) {
      if (this.asistencias.length <= 0) {
        this.asistencias_suscripcion.forEach(asistencia => {
          this.asistenciaService.create(asistencia).subscribe();
        });
      } else {
        this.asistencias.forEach(asistencia => {
          this.asistenciaService.update(asistencia).subscribe();
        });
      }
    }

    this.guardado = true;
    this.taller_seleccionado = undefined;
    this.horario_seleccionado = undefined;
  }

  crearAsistencias(): void {
    this.vaciarListas();
    this.suscripciones_taller.forEach(suscripcion => {
      const hora_inicio = parseInt(this.horario_seleccionado!.horaInicioTaller!.split(':')[0], 10);
      const nueva_asistencia: IAsistencia = {
        alumno: suscripcion.alumno,
        fecha: dayjs().hour(hora_inicio),
        asistencia: false,
        taller: this.taller_seleccionado,
      };
      this.asistencias_suscripcion.push(nueva_asistencia);
    });
  }

  actualizarAsistencia(asistencia: IAsistencia, checked: boolean): void {
    asistencia.asistencia = checked;
  }

  vaciarListas(): void {
    this.asistencias = [];
    this.asistencias_suscripcion = [];
  }

  vaciarTallerHorario(): void {
    this.taller_seleccionado = undefined;
    this.horario_seleccionado = undefined;
  }

  formatoHorario(horario: IHorario): string {
    const semana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'S??bado', 'Domingo'];
    const dia_semana = semana[horario.diaSemana!];
    return `${dia_semana} - ${horario.horaInicioTaller!}`;
  }

  formatoHora(fecha:Dayjs):string{
    return `${fecha.get('hour').toLocaleString()}:00`;
  }

  seleccionarFecha(): void {
    const fecha = dayjs(this.model);
    this.asistenciaService.buscarPorFecha(fecha.format('YYYY-MM-DD')).subscribe({
      next: (res: HttpResponse<IAsistencia[]>) => {
        this.lista_asistencias_comprobacion = res.body ?? [];
      },
    });
  }
}
