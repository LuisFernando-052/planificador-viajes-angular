import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoViaje',
  standalone: true
})
export class EstadoViajePipe implements PipeTransform {
  transform(estado: string, formato: 'texto' | 'emoji' | 'completo' = 'completo'): string {
    const estados: { [key: string]: { texto: string; emoji: string } } = {
      'planificado': { texto: 'Planificado', emoji: '📅' },
      'en-curso': { texto: 'En Curso', emoji: '🚀' },
      'completado': { texto: 'Completado', emoji: '✅' },
      'cancelado': { texto: 'Cancelado', emoji: '❌' }
    };

    const estadoInfo = estados[estado] || { texto: estado, emoji: '📌' };

    switch (formato) {
      case 'texto':
        return estadoInfo.texto;
      case 'emoji':
        return estadoInfo.emoji;
      case 'completo':
        return `${estadoInfo.emoji} ${estadoInfo.texto}`;
      default:
        return estadoInfo.texto;
    }
  }
}