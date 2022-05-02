import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { TallerService } from "app/entities/taller/service/taller.service";
import { ITaller } from "app/entities/taller/taller.model";


@Component({
  selector: 'jhi-formulario-suscripcion',
  templateUrl: './formulario-suscripcion.component.html',
  styleUrls: ['./formulario-suscripcion.component.scss'],
})
export class FormularioSuscripcionComponent implements OnInit {
  titulo = ''

  talleres_disponibles:ITaller[] = []
  taller_seleccionado?:ITaller = undefined;

  constructor(public tallerService:TallerService) {
    this.titulo = ''

    this.loadTalleres();
  }

  ngOnInit(): void {
    this.titulo = ''
  }

  loadTalleres():void{
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

  seleccionarTaller(taller:ITaller):void{
    this.taller_seleccionado = taller;
  }
}