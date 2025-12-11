import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLegible',
  standalone: true
})
export class FechaLegiblePipe implements PipeTransform {
  
  private meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  transform(fecha: Date | string, formato: 'corto' | 'largo' | 'mes' = 'largo'): string {
    if (!fecha) return '';
    
    const date = new Date(fecha);
    const dia = date.getDate();
    const mes = this.meses[date.getMonth()];
    const año = date.getFullYear();

    switch (formato) {
      case 'corto':
        return `${dia} ${mes.substring(0, 3)}`;
      case 'mes':
        return `${mes} ${año}`;
      case 'largo':
      default:
        return `${dia} de ${mes}, ${año}`;
    }
  }
}