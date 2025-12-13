#  Planificador de Viajes

Aplicación web desarrollada con **Angular** y **Firebase** para gestionar y planificar viajes de manera eficiente. Permite crear viajes, agregar actividades, controlar presupuestos y llevar un seguimiento completo de cada aventura.

---

## 📋 Nombre y Descripción del Proyecto

**Nombre:** Planificador de Viajes

**Descripción:**  
Aplicación CRUD completa que permite a usuarios registrados planificar y organizar sus viajes de forma detallada. Cada viaje puede contener múltiples actividades programadas con horarios, categorías y costos específicos. Incluye un dashboard con estadísticas en tiempo real, sistema de autenticación seguro y una interfaz moderna y responsiva.

**[https://planificador-viajes-87c70.web.app](https://planificador-viajes-87c70.web.app)**

---

## 🛠️ Tecnologías y Herramientas Utilizadas

### **Frontend**
- **Angular 20** - Framework principal (Standalone Components)
- **TypeScript 5.x** - Lenguaje de programación tipado
- **RxJS 7.x** - Programación reactiva con Observables
- **CSS3** - Estilos personalizados sin frameworks externos

### **Backend y Base de Datos**
- **Firebase Authentication** - Gestión de usuarios (Email/Password y Google OAuth)
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **AngularFire** - Integración oficial de Angular con Firebase
- **Firebase Hosting** - Despliegue y hosting de la aplicación

### **Herramientas de Desarrollo**
- **Angular CLI 20** - Generación y gestión del proyecto
- **Node.js 18+** - Entorno de ejecución
- **npm** - Gestor de paquetes
- **Git & GitHub** - Control de versiones
- **Firebase CLI** - Herramientas de línea de comandos para Firebase

---

##  Requisitos para Instalar y Ejecutar

### **Requisitos Previos:**

- **Node.js** versión 18 o superior → [Descargar aquí](https://nodejs.org/)
- **npm** versión 9 o superior (incluido con Node.js)
- **Angular CLI** versión 20 o superior
- **Git** → [Descargar aquí](https://git-scm.com/)
- **Cuenta de Firebase** → [Crear cuenta gratuita](https://firebase.google.com/)

### **Verificar instalación:**
```bash
node --version   # Debe mostrar v18.x o superior
npm --version    # Debe mostrar v9.x o superior
ng version       # Debe mostrar Angular CLI 20.x
```

### **Pasos de Instalación:**

#### **1. Clonar el repositorio**
```bash
git clone https://github.com/LuisFernando-052/planificador-viajes-angular.git
cd planificador-viajes-angular
```

#### **2. Instalar dependencias**
```bash
npm install
```

#### **3. Configurar Firebase**

Crear archivo `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
  }
};
```

> **Nota:** Obtén estas credenciales desde [Firebase Console](https://console.firebase.google.com/) → Configuración del proyecto

#### **4. Ejecutar el servidor de desarrollo**
```bash
ng serve
```

Abrir navegador en: `http://localhost:4200`

#### **5. Build para producción**
```bash
ng build --configuration production
```

---

## 🏗️ Breve Descripción de la Arquitectura

### **Componentes Principales**

#### **1. Módulo de Autenticación**
- **LoginComponent** - Formulario de inicio de sesión con email/password y Google
- **RegisterComponent** - Formulario de registro de nuevos usuarios
- Validaciones reactivas en tiempo real

#### **2. DashboardComponent**
- Vista principal tras autenticación
- Tarjetas de estadísticas (total viajes, planificados, en curso, completados)
- Próximo viaje destacado con imagen de fondo

#### **3. Módulo de Viajes**
- **ListaViajesComponent** - Listado con búsqueda y filtros en tiempo real
- **DetalleViajeComponent** - Información completa del viaje y sus actividades
- **FormViajeComponent** - Formulario para crear/editar viajes

#### **4. Módulo de Actividades**
- **FormActividadComponent** - Formulario para crear/editar actividades
- Selector de hora en formato 12h (AM/PM)
- Selector visual de categorías con iconos

#### **5. Componentes Compartidos**
- **NavbarComponent** - Barra de navegación con menú de usuario
- **ToastComponent** - Notificaciones toast para feedback

### **Servicios Principales**

#### **AuthService** (`src/app/core/services/auth.service.ts`)
```typescript
- register(email, password): Promise<UserCredential>
- login(email, password): Promise<UserCredential>
- loginWithGoogle(): Promise<UserCredential>
- logout(): Promise<void>
- getCurrentUser(): Observable<User | null>
```

#### **ViajesService** (`src/app/core/services/viajes.service.ts`)
```typescript
- getViajes(userId): Observable<Viaje[]>
- getViajeById(id): Observable<Viaje>
- addViaje(viaje): Promise<string>
- updateViaje(id, viaje): Promise<void>
- deleteViaje(id): Promise<void>
- getProximoViaje(userId): Observable<Viaje>
```

#### **ActividadesService** (`src/app/core/services/actividades.service.ts`)
```typescript
- getActividadesByViaje(viajeId): Observable<Actividad[]>
- getActividadById(id): Observable<Actividad>
- addActividad(actividad): Promise<string>
- updateActividad(id, actividad): Promise<void>
- deleteActividad(id): Promise<void>
- toggleCompletada(id, completada): Promise<void>
```

#### **ToastService** (`src/app/core/services/toast.service.ts`)
```typescript
- success(message): void
- error(message): void
- warning(message): void
- info(message): void
```

### **Guards**

#### **AuthGuard** (`src/app/core/guards/auth.guard.ts`)
- Protege rutas que requieren autenticación
- Redirige a `/login` si el usuario no está autenticado
- Rutas protegidas: `/dashboard`, `/viajes`, `/viajes/:id`, `/actividades/*`

### **Estructura del Proyecto**
```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   ├── viaje.model.ts
│   │   ├── actividad.model.ts
│   │   └── usuario.model.ts
│   └── services/
│       ├── auth.service.ts
│       ├── viajes.service.ts
│       ├── actividades.service.ts
│       └── toast.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── viajes/
│   │   ├── lista-viajes/
│   │   ├── detalle-viaje/
│   │   └── form-viaje/
│   └── actividades/
│       └── form-actividad/
├── shared/
│   ├── navbar/
│   ├── toast/
│   └── delete-account-modal/
└── app.routes.ts
```

---

## 🌐 URL de Firebase Hosting donde se hizo el Deploy

**Aplicación en producción:**  
🔗 **[https://planificador-viajes-87c70.web.app](https://planificador-viajes-87c70.web.app)**

### **Comandos usados para el deploy:**
```bash
# 1. Build de producción
ng build --configuration production

# 2. Deploy a Firebase Hosting
firebase deploy --only hosting
```

---

## 🎥 URL de un Video de 5 a 8 Minutos

📹 **Video demostración completo:**  
🔗 **[https://youtu.be/tJc3MM86vBY](https://youtube.com/tu-video-aqui)**

### **Contenido del Video:**

#### **1. Funcionalidades Principales (2-3 minutos)**
- Registro de nuevo usuario con email/password
- Login con Google OAuth
- Dashboard con estadísticas en tiempo real
- Crear nuevo viaje con formulario validado
- Agregar actividades con selector de hora AM/PM
- Búsqueda y filtros en tiempo real
- Editar y eliminar viajes/actividades
- Marcar actividades como completadas

#### **2. Flujo de Autenticación (1 minuto)**
- Demostración de registro
- Login con email y contraseña
- Login con Google
- Protección de rutas con AuthGuard
- Logout

#### **3. Registro y Lectura de Datos en Firestore (1-2 minutos)**
- Mostrar colección `viajes` en Firebase Console
- Mostrar colección `actividades` en Firebase Console
- Crear un viaje y ver cómo se guarda en Firestore
- Crear una actividad y ver la relación con el viaje
- Actualización en tiempo real de datos

#### **4. Explicación Breve del Código (2-3 minutos)**

**Componentes:**
```typescript
// Ejemplo: FormViajeComponent
- FormBuilder para formularios reactivos
- Validators para validaciones
- Router para navegación
- ViajesService para CRUD
```

**Servicios:**
```typescript
// Ejemplo: ViajesService
- Inyección de Firestore
- Métodos CRUD con AngularFire
- Observables para datos en tiempo real
```

**Guards:**
```typescript
// AuthGuard
- CanActivate para proteger rutas
- Verificación de usuario autenticado
- Redirección a login si no autenticado
```

---

## 📖 Manual de Usuario

### **1. Registro e Inicio de Sesión**

#### **Opción A: Registro con Email**
1. Acceder a la aplicación en [[URL de la app](https://planificador-viajes-87c70.web.app)]
2. Hacer clic en **"Regístrate aquí"**
3. Completar el formulario:
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
4. Clic en **"Crear Cuenta"**
5. Serás redirigido automáticamente al Dashboard

#### **Opción B: Inicio de Sesión con Google**
1. Hacer clic en **"Continuar con Google"**
2. Seleccionar tu cuenta de Google
3. Autorizar la aplicación
4. Acceso inmediato al Dashboard

#### **Inicio de Sesión Tradicional**
1. Ingresar email y contraseña
2. Clic en **"Iniciar Sesión"**
3. Si las credenciales son correctas, acceso al Dashboard

---

### **2. Dashboard - Funcionalidades Principales**

Al iniciar sesión verás:

#### **Tarjetas de Estadísticas**
- **🧳 Total de Viajes:** Muestra la cantidad total de viajes creados
- **📋 Planificados:** Viajes en estado "planificado"
- **✈️ En Curso:** Viajes actualmente activos
- **✅ Completados:** Viajes finalizados

#### **Tu Próximo Viaje**
- Muestra el viaje más cercano con imagen de fondo
- Información destacada: fechas, duración, presupuesto y estado
- Botón **"Ver detalles"** para ir al viaje completo

---

### **3. Gestión de Viajes**

#### **Crear un Nuevo Viaje**

1. Ir a **"Mis Viajes"** en el menú de navegación
2. Hacer clic en **"Nuevo Viaje"** (botón superior derecho)
3. Completar el formulario:

| Campo | Descripción | Validación |
|-------|-------------|------------|
| **Destino** | Nombre del lugar de destino | Obligatorio, mín. 3 caracteres |
| **Descripción** | Detalles y descripción del viaje | Obligatorio, mín. 10 caracteres |
| **Fecha de Inicio** | Fecha de inicio del viaje | Obligatorio |
| **Fecha de Fin** | Fecha de finalización | Obligatorio, debe ser > fecha inicio |
| **Presupuesto** | Monto estimado en dólares | Obligatorio, debe ser > 0 |
| **Estado** | Planificado / En Curso / Completado / Cancelado | Obligatorio |
| **URL de Imagen** | Link de imagen del destino | Opcional |

4. El sistema calcula automáticamente la **duración en días**
5. Hacer clic en **"Crear Viaje"**
6. Recibirás notificación de éxito y serás redirigido a la lista

#### **Ver Lista de Viajes**
- Visualiza todos tus viajes en cards con:
  - Imagen del destino
  - Nombre del destino
  - Fechas de inicio y fin
  - Duración calculada
  - Presupuesto
  - Badge de estado con color

#### **Buscar y Filtrar Viajes**
1. **Búsqueda en tiempo real:**
   - Escribir en el campo de búsqueda
   - Filtra por destino o descripción
   - Resultados instantáneos

2. **Filtrar por estado:**
   - Seleccionar en dropdown: Todos, Planificados, En Curso, Completados, Cancelados

3. **Ordenar:**
   - Por fecha de creación
   - Por destino (alfabético)
   - Por presupuesto

#### **Ver Detalle de un Viaje**
1. Hacer clic en **"Ver más"** en cualquier tarjeta de viaje
2. Visualizarás:
   - Información completa del viaje
   - Imagen destacada
   - Lista de todas las actividades asociadas
   - Opciones para editar o eliminar el viaje
   - Botón para crear nueva actividad

#### **Editar un Viaje**
1. Desde el detalle del viaje, clic en **"Editar Viaje"**
2. Modificar los campos deseados
3. Hacer clic en **"Actualizar"**
4. Notificación de éxito

#### **Eliminar un Viaje**
1. Desde el detalle del viaje, clic en **"Eliminar"**
2. Confirmar la acción en el modal
3. ⚠️ **IMPORTANTE:** Se eliminarán también todas las actividades asociadas

---

### **4. Gestión de Actividades**

#### **Crear Nueva Actividad**

1. Entrar al detalle de un viaje
2. Hacer clic en **"Nueva Actividad"**
3. Completar el formulario:

| Campo | Descripción | Validación |
|-------|-------------|------------|
| **Nombre** | Título de la actividad | Obligatorio, mín. 3 caracteres |
| **Descripción** | Detalles de la actividad | Obligatorio, mín. 5 caracteres |
| **Categoría** | Tipo de actividad | Obligatorio, selección visual |
| **Fecha** | Día de la actividad | Obligatorio |
| **Hora** | Hora en formato 12h | Obligatorio, formato AM/PM |
| **Costo** | Precio en dólares | Obligatorio, debe ser ≥ 0 |

**Categorías Disponibles:**
- 🏛️ **Turismo** - Visitas a lugares históricos, museos
- 🍽️ **Comida** - Restaurantes, cafés, degustaciones
- 🏔️ **Aventura** - Deportes extremos, hiking, escalada
- 🎭 **Cultura** - Teatro, eventos culturales, espectáculos
- 🎉 **Diversión** - Entretenimiento, parques, vida nocturna
- 🛍️ **Compras** - Shopping, mercados, souvenirs
- 🚗 **Transporte** - Traslados, taxis, alquiler de vehículos
- 🏨 **Alojamiento** - Hoteles, hostales, reservas

#### **Selector de Hora (Formato 12h)**
- **Hora:** Seleccionar de 01 a 12
- **Minutos:** 00, 15, 30, 45
- **Período:** AM (mañana) o PM (tarde/noche)
- **Ejemplo:** 02:30 PM = 2:30 de la tarde

4. Hacer clic en **"Crear Actividad"**
5. La actividad se agregará a la lista del viaje

#### **Marcar Actividad como Completada**
1. En la lista de actividades del viaje
2. Hacer clic en el **checkbox** junto a la actividad
3. La actividad se marcará con:
   - Texto tachado
   - Badge verde "Completada"

#### **Editar una Actividad**
1. Hacer clic en el botón **"Editar"** (ícono de lápiz)
2. Modificar los campos necesarios
3. Guardar cambios

#### **Eliminar una Actividad**
1. Hacer clic en el botón **"Eliminar"** (ícono de basura)
2. Confirmar la eliminación en el modal
3. La actividad se eliminará permanentemente

---

### **5. Navegación y Menú de Usuario**

#### **Barra de Navegación**
- **Logo:** Clic para volver al inicio
- **Dashboard:** Vista principal con estadísticas
- **Mis Viajes:** Lista completa de viajes
- **Usuario:** Muestra email

#### **Menú de Usuario**
- **Email del usuario:** Se muestra en la navbar
- **Cerrar Sesión:** Cierra sesión y redirige al login

---

### **6. Cerrar Sesión**

1. Hacer clic en tu **email** en la barra de navegación
2. Seleccionar **"Cerrar Sesión"**
3. Confirmar acción
4. Serás redirigido a la página de login

---

### **7. Consejos y Buenas Prácticas**

#### **Para crear viajes efectivos:**
- ✅ Usa nombres de destino descriptivos
- ✅ Agrega imágenes representativas (URLs de buena calidad)
- ✅ Define presupuestos realistas
- ✅ Actualiza el estado según avance el viaje

#### **Para gestionar actividades:**
- ✅ Agregar actividades en orden cronológico
- ✅ Incluir detalles importantes en la descripción
- ✅ Seleccionar la categoría correcta para mejor organización
- ✅ Marcar como completadas para llevar seguimiento

#### **Búsqueda eficiente:**
- ✅ Usar palabras clave del destino
- ✅ Filtrar por estado para encontrar viajes específicos
- ✅ Ordenar por fecha para ver viajes recientes

---

### **9. Solución de Problemas Comunes**

#### **No puedo iniciar sesión**
- Verificar que el email esté escrito correctamente
- Asegurar que la contraseña sea la correcta (mínimo 6 caracteres)
- Si olvidaste tu contraseña, contactar al administrador

#### **No aparecen mis viajes**
- Verificar que estés autenticado con la cuenta correcta
- Refrescar la página (F5)
- Verificar conexión a internet

#### **Error al crear viaje**
- Verificar que todos los campos obligatorios estén completos
- La fecha de fin debe ser posterior a la fecha de inicio
- El presupuesto debe ser mayor a 0

#### **Error al agregar actividad**
- Verificar que la fecha de la actividad esté dentro del rango del viaje
- Asegurar que todos los campos estén completos
- El costo debe ser mayor o igual a 0

---

### **10. Requisitos del Sistema**

#### **Navegadores Compatibles:**
- ✅ Google Chrome (versión 90+)
- ✅ Mozilla Firefox (versión 88+)
- ✅ Microsoft Edge (versión 90+)
- ✅ Safari (versión 14+)

#### **Dispositivos:**
- ✅ Computadoras de escritorio
- ✅ Laptops
- ✅ Tablets

#### **Conexión a Internet:**
- ⚠️ Requerida para todas las funcionalidades
- La aplicación no funciona offline (requiere Firebase)

---

## 👨‍💻 Autor

**Luis Fernando**

- 📧 **Email:** luisfernandoquispelizunde052@gmail.com
- 🐙 **GitHub:** [@LuisFernando-052](https://github.com/LuisFernando-052)
- 📂 **Repositorio:** [planificador-viajes-angular](https://github.com/LuisFernando-052/planificador-viajes-angular)

---

## 📅 Información del Proyecto

- **Curso:** Programación We
- **Institución:** [Jose Maria Arguedas]
- **Docente:** [Ivan Soria Solis]
- **Usuario GitHub Docente:** `ivansoriasolis` ✅ *Invitado como colaborador*
- **Duración:** 5 semanas

---

**Última actualización:** Diciembre 2025

</div>