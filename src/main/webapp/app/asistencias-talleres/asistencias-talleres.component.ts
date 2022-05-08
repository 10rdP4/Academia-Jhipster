import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { IHorario } from "app/entities/horario/horario.model";
import { HorarioService } from "app/entities/horario/service/horario.service";
import { SuscripcionService } from "app/entities/suscripcion/service/suscripcion.service";
import { ISuscripcion } from "app/entities/suscripcion/suscripcion.model";
import { TallerService } from "app/entities/taller/service/taller.service";
import { ITaller } from "app/entities/taller/taller.model";


@Component({
  selector: 'jhi-asistencias-talleres',
  templateUrl: './asistencias-talleres.component.html',
  styleUrls: ['./asistencias-talleres.component.scss']
})
export class AsistenciasTalleresComponent implements OnInit {
  titulo = '';

  // Carga de datos
  talleres_disponibles: ITaller[] = [];
  horarios_taller: IHorario[] = [];
  suscripciones_taller: ISuscripcion[] = [];

  // Selecciones
  taller_seleccionado?: ITaller = undefined;
  horario_seleccionado?: IHorario = undefined;


  constructor(public tallerService: TallerService,
    public horarioService: HorarioService,
    public suscripcionService: SuscripcionService) {
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
        },
      });
  }

  seleccionarTaller(taller: ITaller): void {
    this.taller_seleccionado = taller;
    // Cargar los horarios de ese taller
    this.horarioService.findHorarioByTaller(taller.id!).subscribe({
      next: (res: HttpResponse<IHorario[]>) => {
        this.horarios_taller = res.body ?? [];
      }
    })

    this.suscripcionService.buscarSucripcionPorTaller(this.taller_seleccionado.id!).subscribe({
      next: (res: HttpResponse<ISuscripcion[]>) => {
        this.suscripciones_taller = res.body ?? [];
      }
    })
  }

  seleccionarHorario(horario: IHorario): void {
    this.horario_seleccionado = horario;

    
  }

  formatoHorario(horario: IHorario): string {
    const semana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const dia_semana = semana[horario.diaSemana!];
    return `${dia_semana} - ${horario.horaInicioTaller!}`;
  }
}