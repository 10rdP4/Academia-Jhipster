import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SuscripcionService } from 'app/entities/suscripcion/service/suscripcion.service';
import { ISuscripcion } from 'app/entities/suscripcion/suscripcion.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'jhi-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.html'],
})
export class EstadisticasComponent implements OnInit {
  titulo = 'Estadisticas';
  lista_suscripciones: ISuscripcion[] = [];
  taller_cantidad = new Map<string, number>();

  claves: string[] = [];
  valores: number[] = [];
  colores: string[] = [];

  constructor(public suscripcionService: SuscripcionService) {
    this.titulo = '';
  }

  ngOnInit(): void {
    this.titulo = '';
    this.cargarSuscripciones();
  }

  cargarSuscripciones(): void {
    this.suscripcionService
      .query({
        size: 300,
      })
      .subscribe({
        next: (res: HttpResponse<ISuscripcion[]>) => {
          this.lista_suscripciones = res.body ?? [];
          this.lista_suscripciones.forEach(suscripcion => {
            const nombre = suscripcion.taller!.nombre!;
            if (this.taller_cantidad.has(nombre)) {
              this.taller_cantidad.set(nombre, this.taller_cantidad.get(nombre)! + 1);
            } else {
              this.taller_cantidad.set(nombre, 1);
            }
          });

          for (const key of this.taller_cantidad.keys()) {
            this.claves.push(key);
            this.valores.push(this.taller_cantidad.get(key)!);
          }
          this.generarColores();

          this.crearGrafico();
        },
      });
  }

  generarColores(): void {
    const color_max = 16777215;
    const color_var = color_max / this.claves.length;
    let current_color = color_max;
    for (let i = 0; i < this.claves.length; i++) {
      current_color -= color_var;
      this.colores.push(`#${Math.trunc(current_color).toString(16)}`);
    }
  }

  crearGrafico(): void {
    const myChart = new Chart('chart', {
      type: 'pie',
      data: {
        labels: this.claves,
        datasets: [
          {
            label: '# Numero de suscripciones',
            data: this.valores,
            backgroundColor: this.colores,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
