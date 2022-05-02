import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { IHorario } from "app/entities/horario/horario.model";
import { HorarioService } from "app/entities/horario/service/horario.service";
import { TallerService } from "app/entities/taller/service/taller.service";
import { ITaller } from "app/entities/taller/taller.model";


@Component({
  selector: 'jhi-formulario-suscripcion',
  templateUrl: './formulario-suscripcion.component.html',
  styleUrls: ['./formulario-suscripcion.component.scss'],
})
export class FormularioSuscripcionComponent implements OnInit {
  titulo = ''

  talleres_disponibles: ITaller[] = []
  taller_seleccionado?: ITaller = undefined;

  constructor(public tallerService: TallerService, public horarioService: HorarioService) {
    this.titulo = ''

    this.loadTalleres();
  }

  ngOnInit(): void {
    this.titulo = ''
  }

  loadTalleres(): void {
    this.tallerService
      .query({
        size: 50,
      })
      .subscribe({
        next: (res: HttpResponse<ITaller[]>) => {
          this.talleres_disponibles = res.body ?? [];
        }
      });
  }

  seleccionarTaller(taller: ITaller): void {
    this.taller_seleccionado = taller;

    // Cargamos los horarios de ese taller
    this.horarioService.findHorarioByTaller(this.taller_seleccionado.id!).subscribe({
      next: (res: HttpResponse<IHorario[]>) => {
        this.taller_seleccionado!.horarios = res.body ?? [];
      }
    });
  }

  formatoHorario(horario: IHorario): string {
    let dia_semana = ''

    switch (horario.diaSemana) {
      case 0:
          dia_semana = 'Lunes'
        break;
      case 1:
        dia_semana = 'Martes'
        break;
      case 2:
        dia_semana = 'Miercoles'
        break;
      case 3:
        dia_semana = 'Jueves'
        break;
      case 4:
        dia_semana = 'Viernes'
        break;
      case 5:
        dia_semana = 'Sábado'
        break;
      case 6:
        dia_semana = 'Domingo'
        break;

      default:
        dia_semana = 'Error'
        break;
    }

    return `${dia_semana} - ${horario.horaInicioTaller!}`
  }
}