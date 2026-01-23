# 🏢 Illusion Rack Designer Pro v2.0.0

## 🎉 **VERSIÓN FINAL - ENERO 2025**

**Diseñador profesional de racks audiovisuales con cálculos automáticos y gestión de proyectos.**

---

## 🚀 **Inicio Rápido**

```bash
# Clonar repositorio
git clone https://github.com/jonycusac-bot/illusion-rack-designer.git

# Instalar dependencias
cd illusion-rack-designer
npm install

# Ejecutar aplicación
npm run dev

# Abrir en navegador: http://localhost:5173/
```

---

## ✨ **Características Principales**

### 🎨 **Interfaz Intuitiva**
- **7 categorías** de equipos con iconos coloridos
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
- **Nombres automáticos** con fecha y hora
- **Gestión completa** de proyectos guardados

### 📄 **Exportación Profesional**
- **"Descargar Materiales de Rack"**
- **Solo infraestructura** (sin equipos físicos)
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

---

## 🎯 **Cómo Usar**

### 1. **Seleccionar Equipos**
- Haz clic en las categorías del panel izquierdo
- Selecciona los equipos necesarios
- Se añaden automáticamente al rack

### 2. **Visualizar Rack**
- Ve el diseño en tiempo real en el centro
- Colores por categoría para fácil identificación
- Cálculos automáticos en el panel derecho

### 3. **Gestionar Proyecto**
- **💾 Guardar**: Botón verde en el header
- **📁 Cargar**: Botón azul con dropdown
- **🔄 Limpiar**: Botón rojo para empezar de nuevo

### 4. **Exportar Materiales**
- Botón "Descargar Materiales de Rack"
- Listado completo para el instalador
- Solo materiales de infraestructura

---

## 🔧 **Tecnologías**

- **React 19.2.0** - Framework principal
- **Vite** - Build tool y dev server
- **Lucide React** - Iconos
- **CSS personalizado** - Estilos optimizados
- **localStorage** - Persistencia de proyectos

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
└── App.css          # Configuración del contenedor
```

### Funciones Principales
- `agregarItem()` - Añade equipos al rack
- `guardarProyecto()` - Guarda en localStorage
- `descargarMaterialesRack()` - Exporta listado
- `toggleCategoria()` - Gestiona pestañas

---

## 🏆 **Estado del Proyecto**

### ✅ **Completado**
- ✅ Interfaz completa y funcional
- ✅ Todos los cálculos automáticos
- ✅ Sistema de proyectos
- ✅ Exportación de materiales
- ✅ Documentación completa

### 🎯 **Listo para Producción**
**Illusion Rack Designer Pro v2.0.0** está completamente terminado y listo para uso profesional.

---

## 📞 **Contacto**

**Illusion AV Solutions**
- 📧 Email: info@illusion-av.com
- 🌐 Web: www.illusion-av.com

---

## 📄 **Licencia**

Proyecto desarrollado para Illusion AV Solutions - Enero 2025

---

**🎉 ¡Gracias por usar Illusion Rack Designer Pro!**