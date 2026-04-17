# Informe General del Proyecto Web

## 1) Resumen ejecutivo
Este proyecto es una aplicación web desarrollada con **React + TypeScript + Vite**. Está enfocada en un sitio corporativo público y un panel administrativo interno para gestionar el contenido.

En la parte pública, se muestran secciones como inicio, servicios, proyectos, contacto, testimonios y nosotros. En la parte privada (admin), se permite actualizar secciones clave del sitio desde un dashboard protegido por autenticación.

## 2) Objetivo del sistema
El objetivo principal es centralizar la presentación de la empresa y permitir que el equipo administrador gestione:

- Información de página de inicio.
- Sección “Quiénes somos”.
- Catálogo de servicios.
- Portafolio de proyectos.
- Contactos recibidos.
- Testimonios.
- Configuración general del sitio.
- Recursos multimedia y logs administrativos.

## 3) Estructura funcional del sitio
### 3.1 Sitio público
Rutas principales del sitio:

- `/` (Inicio)
- `/nosotros`
- `/servicios`
- `/servicios/:slug`
- `/proyectos`
- `/proyectos/:slug`
- `/contacto`
- `/dejar-testimonio`

La vista de inicio integra módulos de héroe, estadísticas, servicios, sobre nosotros, proyectos, testimonios y llamada a la acción.

### 3.2 Panel administrativo
El panel admin está bajo rutas protegidas y contiene módulos para:

- Dashboard
- Inicio
- Quiénes somos
- Servicios
- Proyectos
- Contactos
- Testimonios
- Configuración
- Logs
- Media

Además, cuenta con navegación lateral, cambio de tema claro/oscuro y acción de cierre de sesión.

## 4) Arquitectura técnica
- **Framework**: React 19 con TypeScript.
- **Build tool**: Vite.
- **Navegación**: React Router.
- **Manejo de formularios**: react-hook-form + zod.
- **UI**: Tailwind, MUI y componentes propios.
- **Consumo de API**: Axios.
- **Mapas y media**: Leaflet/react-leaflet y módulos de media.

## 5) Gestión de datos y bootstrapping
El proyecto utiliza hooks de bootstrap para cargar datos al inicio según la página, evitando solicitudes repetidas cuando ya existe información en estado global.

Esto mejora tiempo de carga percibido y consistencia entre secciones reutilizadas.

## 6) Seguridad y autenticación
La capa HTTP incluye:

- Cliente público y cliente autenticado.
- Inyección automática del token de acceso (`Bearer`) en requests privados.
- Mecanismo de refresh token al detectar `401`.
- Cierre de sesión forzado cuando no hay refresh válido o falla la renovación.

## 7) Valor para el negocio
Este sistema permite que el contenido corporativo sea administrable sin tocar código fuente en cada cambio editorial, facilitando:

- Actualización continua del sitio.
- Mayor autonomía del equipo de administración.
- Escalabilidad para agregar nuevas secciones o módulos.
- Mejor experiencia para visitantes y para operadores internos.

## 8) Conclusión
La aplicación está preparada como una plataforma web empresarial moderna: separa experiencia pública y gestión interna, aplica buenas prácticas de enrutamiento, autenticación y consumo de API, y ofrece una base sólida para evolucionar funcionalidades de contenido y operación digital.
