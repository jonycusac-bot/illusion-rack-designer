# 🏢 Illusion Rack Designer Pro v3.0.0

## Versión actual — Septiembre 2026

**Diseñador profesional de racks audiovisuales con cálculos automáticos y gestión de proyectos.**

---

## 🚀 **Inicio Rápido**

```bash
# Clonar repositorio
git clone https://github.com/Jonycusac/illusion-rack-designer.git

# Instalar dependencias
cd illusion-rack-designer
npm install

# Ejecutar aplicación
npm run dev

# Abrir en navegador: http://localhost:3000/
```

---

## ✨ **Características Principales**

### 🎨 **Interfaz Intuitiva**
- **8 categorías base** de equipos con iconos coloridos
- **Equipos personalizados** creados por el usuario con categoría dinámica propia
- **Auto-replegado** de pestañas (10 segundos)
- **Visualización en tiempo real** del rack
- **Diseño profesional** con fondo negro elegante

### 🔧 **Cálculos Automáticos**
- **Regletas PDU** (1 cada 6 equipos)
- **Tornillería completa** (4 tornillos por equipo)
- **Patch Panels automáticos** con routers UniFi
- **Consumo eléctrico** total
- **Tamaño de rack** recomendado

### 💾 **Gestión de Proyectos**
- **Guardar/Cargar** proyectos con un clic
- **Persistencia local** en el navegador
- **Catálogo personalizado persistente** con creación, edición y eliminación
- **Nombres automáticos** con fecha y hora
- **Gestión completa** de proyectos guardados

### ✉️ **Propuestas de Equipos**
- URL oficial o ficha PDF como fuente de cada equipo personalizado
- Uso inmediato y almacenamiento local en el navegador del usuario
- Envío automático de una ficha estructurada a `jonycusac@gmail.com` mediante FormSubmit
- Confirmación visual de envío, espera y error dentro del configurador
- Ningún producto se almacena ni se publica automáticamente en Firebase
- Incorporación manual al catálogo oficial únicamente después de revisar la fuente y los datos técnicos

### 📄 **Exportación Profesional**
- **"Descargar dossier PDF"**
- **Infraestructura, equipos instalados y alzado frontal**
- **Formato profesional** para instaladores
- **Listado completo** de materiales necesarios

---

## 📋 **Catálogo de Equipos**

| Categoría | Equipos Disponibles | Icono |
|-----------|-------------------|-------|
| 🌐 **Redes** | UniFi Dream Machine Pro, Switches | 📶 |
| ⚙️ **Control** | Crestron CP4/RMC4, Beoliving | ⚙️ |
| 🔊 **Audio** | BeoCore, Sonance DSP, Sonos Amp | 🔊 |
| 📺 **Video** | Apple TV 4K, Kaleidescape | 📺 |
| 🎬 **Cinema** | Marantz AV, Integra DRX | 🎬 |
| ⚡ **Energía** | SAI APC Smart-UPS | 🔋 |
| 📦 **Otros** | Equipos genéricos 1U-4U | 📦 |
| 🧰 **Accesorios** | Baldas, pasacables y elementos auxiliares | 🧰 |
| ✨ **Personalizados** | Equipos creados por el usuario | ✨ |

---

## 🎯 **Cómo Usar**

### 1. **Seleccionar Equipos**
- Haz clic en las categorías del panel izquierdo
- Selecciona los equipos necesarios
- Se añaden automáticamente al rack
- Usa **Crear equipo personalizado** para registrar fabricante, modelo, unidades, profundidad, consumo y requisitos de montaje

### 2. **Visualizar Rack**
- Ve el diseño en tiempo real en el centro
- Colores por categoría para fácil identificación
- Cálculos automáticos en el panel derecho

### 3. **Gestionar Proyecto**
- **💾 Guardar**: Botón verde en el header
- **📁 Cargar**: Botón azul con dropdown
- **🔄 Limpiar**: Botón rojo para empezar de nuevo

### 4. **Exportar Materiales**
- Botón "Descargar dossier PDF"
- Listado de infraestructura y equipos para el instalador
- Alzado frontal y resumen eléctrico del rack

---

## 🔧 **Tecnologías**

- **React 19.2.0** - Framework principal
- **Vite** - Build tool y dev server
- **Lucide React** - Iconos
- **CSS personalizado** - Estilos optimizados
- **localStorage** - Persistencia de proyectos
- **Vitest** - Pruebas de validación y normalización de equipos personalizados

---

## 📊 **Panel de Configuración**

El panel derecho muestra automáticamente:

- **U Frontales Ocupadas** - Espacio usado
- **Regletas PDU** - Alimentación eléctrica
- **Pasacables** - Gestión de cables
- **Placas Ciegas** - Ventilación
- **Escobillas** - Paso de cables
- **Tornillería** - Herrajes necesarios
- **Patch Panels** - Conectividad automática

---

## 🎨 **Características Visuales**

- **Fondo negro elegante** (#020617)
- **Rack ampliado** (800px) para mejor visualización
- **Termostato con icono** de temperatura
- **Efectos hover** suaves y profesionales
- **Transiciones animadas**
- **Diseño responsive**

---

## 📝 **Notas para Desarrolladores**

### Estructura del Proyecto
```
src/
├── App.jsx          # Componente principal
├── main.jsx         # Punto de entrada
├── index.css        # Estilos personalizados
├── customEquipment.js      # Dominio de equipos personalizados
└── customEquipment.test.js # Pruebas automatizadas
```

### Funciones Principales
- `agregarItem()` - Añade equipos al rack
- `guardarProyecto()` - Guarda en localStorage
- `descargarMaterialesRackPDF()` - Exporta el dossier técnico
- `toggleCategoria()` - Gestiona pestañas
- `guardarEquipoPersonalizado()` - Crea o actualiza equipos del usuario

---

## 🏆 **Estado del Proyecto**

### ✅ **Completado**
- ✅ Interfaz completa y funcional
- ✅ Todos los cálculos automáticos
- ✅ Sistema de proyectos
- ✅ Exportación de materiales
- ✅ Documentación completa

### Estado actual
**Illusion Rack Designer Pro v3.0.0** es la versión activa del configurador. Este README es la fuente principal para la versión, ejecución local y características vigentes; el historial de cambios se mantiene en `CHANGELOG.md`.

---

## 📞 **Contacto**

**Illusion AV Solutions**
- 📧 Email: info@illusion-av.com
- 🌐 Web: www.illusion-av.com

---

## 📄 **Licencia**

Proyecto desarrollado para Illusion AV Solutions — Septiembre 2026

---

**🎉 ¡Gracias por usar Illusion Rack Designer Pro!**