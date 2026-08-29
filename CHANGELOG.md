# Changelog - Illusion Rack Designer Pro

## [v3.0.0] - 2026-09

### Versión activa
- **ACTUALIZADO**: Identidad y documentación unificadas en v3.0.0 Pro.
- **ACTUALIZADO**: Fecha de la versión vigente a septiembre de 2026.
- **CORREGIDO**: Puerto local documentado y configurado en `3000`.
- **MEJORADO**: Acción de documentación integrada en el panel técnico.
- **LIMPIEZA**: Eliminados estilos y recursos heredados de Vite sin uso.
- **DOCUMENTACIÓN**: `README.md` pasa a ser la fuente principal del estado y ejecución del proyecto.
- **NUEVO**: Creación manual de equipos personalizados con fabricante, modelo, categoría, espacio, profundidad, consumo, peso y requisitos de montaje.
- **NUEVO**: Categoría dinámica `Personalizados` con edición, eliminación y persistencia local.
- **MEJORADO**: Los equipos personalizados participan en los cálculos, el alzado del rack y el dossier PDF.
- **PRUEBAS**: Cobertura de validación, normalización, persistencia y flujo completo de alta, inserción, edición, eliminación y PDF.
- **NUEVO**: Campo URL oficial con validación y acceso directo a la fuente del producto.
- **NUEVO**: Botón `Enviar equipo para revisión` con entrega AJAX mediante FormSubmit a `jonycusac@gmail.com`.
- **MEJORADO**: Estados visibles de envío, confirmación y error sin depender del cliente de correo del usuario.
- **DECISIÓN**: Los productos personalizados permanecen locales y no se alojan ni publican en Firebase.
- **SEGURIDAD**: Firestore continúa limitado a perfiles y proyectos privados del usuario.

## [v2.0.0] - 2025-01-25

### 🎉 VERSIÓN FINAL - PROYECTO COMPLETADO
- **FINALIZADO**: Todas las funcionalidades principales implementadas
- **LISTO PARA PRODUCCIÓN**: Aplicación completamente funcional

### 💾 Gestión de Proyectos
- **NUEVO**: Sistema completo de guardar/cargar proyectos
- **NUEVO**: Persistencia usando localStorage del navegador
- **NUEVO**: Dropdown con lista de proyectos guardados
- **NUEVO**: Eliminación individual de proyectos
- **NUEVO**: Nombres automáticos con fecha y hora

### 📄 Exportación de Materiales
- **NUEVO**: "Descargar Materiales de Rack" (reemplaza "Descargar Listado BOOM")
- **MEJORADO**: Solo incluye infraestructura y materiales de rack
- **ELIMINADO**: Equipos físicos del listado (más útil para instaladores)
- **NUEVO**: Formato profesional con tablas ASCII
- **NUEVO**: Cálculos detallados de tornillería, baldas, ventilación
- **NUEVO**: Notas técnicas para el instalador

### 🔧 Nuevos Equipos y Categorías
- **NUEVO**: Categoría "Otros" con equipos genéricos (1U, 2U, 3U, 4U)
- **NUEVO**: Sonos Amp en categoría Audio (2U, media balda)
- **NUEVO**: Patch Panel automático con routers UniFi
- **NUEVO**: Sistema de tornillería (4 tornillos por equipo)

### 🎨 Mejoras Visuales Finales
- **MEJORADO**: Rack ampliado a 800px de ancho
- **MEJORADO**: Termostato con icono de temperatura
- **MEJORADO**: Botones de gestión de proyectos en header
- **MEJORADO**: Auto-replegado de pestañas (10 segundos)

### 📊 Panel de Configuración Ampliado
- **NUEVO**: Pestaña "Tornillería" con cálculo automático
- **NUEVO**: Pestaña "Patch Panels (Auto)" con contador
- **MEJORADO**: Todas las pestañas con iconos y colores

## [v1.2.0] - 2025-01-XX

### 🎨 Mejoras de Interfaz de Usuario
- **NUEVO**: Categorías inician replegadas al cargar la aplicación
- **NUEVO**: Iconos coloridos para todas las categorías
- **MEJORADO**: Productos con fondo blanco para mejor legibilidad
- **MEJORADO**: Diseño limpio sin información técnica innecesaria
- **MEJORADO**: Hover effects más sutiles en pestañas principales
- **ELIMINADO**: Badges de consumo, dimensiones y unidades en productos

### 🔧 Mejoras Técnicas
- **AÑADIDO**: Nuevos iconos importados de Lucide React
- **AÑADIDO**: Función getCategoryIcon() para gestión de iconos
- **OPTIMIZADO**: Renderizado de productos más eficiente

## [ef25a00] - 2025-01-XX

### 📝 Documentación
- **AÑADIDO**: Documentación completa del estado del proyecto
- **AÑADIDO**: Instrucciones detalladas de instalación y uso

## [e76f4d9] - 2025-01-XX

### 🎨 Corrección de Estilos
- **CORREGIDO**: Reemplazado Tailwind CSS por CSS personalizado
- **CORREGIDO**: Interfaz funcionando correctamente sin errores
- **AÑADIDO**: Dependencia Lucide React para iconos

## [1697834] - 2025-01-05

### 🔄 Cambios del día 5 de enero
- Mejoras generales en la funcionalidad

## [e795114] - 2025-01-XX

### ⚡ Sistema de Energía
- **AÑADIDO**: Sistema de regletas automático (1 cada 6 equipos)
- **MEJORADO**: Cálculos de consumo eléctrico

## [c266322] - 2025-01-XX

### 🌪️ Sistema de Ventilación
- **AÑADIDO**: Sistema de ventiladores automático
- **MEJORADO**: Gestión térmica del rack

## [65ec09e] - 2025-01-XX

### 🔧 Paso 3 - Funcionalidades Avanzadas
- Implementación de funcionalidades avanzadas

## [90f7733] - 2025-01-XX

### 🔧 Paso 2 - Desarrollo Intermedio
- Desarrollo de funcionalidades intermedias

## [adc1db8] - 2025-01-XX

### 🎉 Primera Versión
- **INICIAL**: Primera versión del Diseñador de Racks
- **INICIAL**: Estructura básica de la aplicación React
- **INICIAL**: Catálogo de equipos por categorías
- **INICIAL**: Visualización básica del rack

---

## Estado de versiones

- **Versión activa:** v3.0.0 Pro — Septiembre 2026.
- Las entradas anteriores se conservan únicamente como historial de evolución.
- Consulta `README.md` para instalación, ejecución local y funcionalidades vigentes.

---

## Leyenda de Tipos de Cambios

- 🎉 **INICIAL**: Funcionalidad nueva desde cero
- 🎨 **MEJORADO**: Mejora de funcionalidad existente
- 🔧 **AÑADIDO**: Nueva funcionalidad
- 🐛 **CORREGIDO**: Corrección de errores
- 📝 **DOCUMENTACIÓN**: Cambios en documentación
- ⚡ **RENDIMIENTO**: Mejoras de rendimiento
- 🔄 **CAMBIO**: Modificación de comportamiento
- ❌ **ELIMINADO**: Funcionalidad eliminada