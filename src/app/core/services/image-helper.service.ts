import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageHelperService {
  
  // Imágenes por defecto según palabras clave en el destino
  private defaultImages: { [key: string]: string } = {
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'londres': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    'nueva york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    'tokio': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    'roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    'madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
    'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
    'berlín': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
    'ámsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    'dubái': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    'cancún': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    'cancun': 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    'río': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
    'rio': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
    'buenos aires': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800',
    'lima': 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800',
    'cusco': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    'machu picchu': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    'playa': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    'montaña': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'ciudad': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    'city': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
  };

  // Imagen por defecto genérica
  private genericImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

  constructor() { }

  getImageForDestination(destino: string, customUrl?: string): string {
    // Si hay URL personalizada, usarla
    if (customUrl && customUrl.trim()) {
      return customUrl;
    }

    // Buscar imagen por palabra clave en el destino
    const destinoLower = destino.toLowerCase();
    
    for (const [keyword, imageUrl] of Object.entries(this.defaultImages)) {
      if (destinoLower.includes(keyword)) {
        return imageUrl;
      }
    }

    // Si no coincide con ninguna, devolver imagen genérica
    return this.genericImage;
  }

  // Generar un gradiente de color según el destino (para fallback)
  getGradientForDestination(destino: string): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
    ];

    // Generar un índice basado en el destino para consistencia
    const hash = destino.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
}