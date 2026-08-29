# Catálogo oficial de equipos

Esta carpeta contiene la fuente oficial y versionada de productos de Illusion Rack Designer.

## Archivos

- `equipmentCatalog.js`: reglas técnicas del rack y fusión final del catálogo.
- `professionalCatalog.json`: datos profesionales generados desde el Excel maestro.
- `mergeProfessionalCatalog.js`: fusión segura por `ID interno`.
- `catalogSchema.js`: categorías permitidas y validación básica de integridad.
- `equipmentCatalog.test.js`: prueba de regresión de IDs, versión y reglas técnicas.
- `scripts/import_catalog_xlsx.py`: importador validado del Excel maestro.

## Reglas

1. Los IDs son estables y no deben cambiarse porque los proyectos guardados dependen de ellos.
2. Los equipos personalizados del usuario no se incorporan aquí automáticamente; permanecen en `localStorage`.
3. La incorporación de propuestas al catálogo oficial sigue siendo manual.
4. El catálogo oficial no se almacena en Firebase.
5. Los códigos internos de ODDO se gestionan en su propio campo y mantienen `XXXXX` hasta recibir el código real.
6. No deben añadirse datos técnicos sin una fuente oficial revisada.
7. Cualquier modificación del catálogo debe actualizar su versión y pasar las pruebas.

## Ficha profesional v1.2.0

Los 32 productos oficiales incluyen `datosProfesionales` importados por `ID interno` con esta información:

- `fabricante` y `modelo`: identificación provisional basada en el nombre actual del catálogo.
- `codigoODDO`: código interno de la empresa; mantiene `XXXXX` hasta recibir el código real.
- `pesoKg`: peso oficial; `null` significa desconocido, nunca 0 kg.
- `consumoNominalW` y `consumoMaximoW`: permanecen en `null` hasta distinguir consumo real, potencia de salida y presupuesto PoE.
- `cargaTermicaW`: permanece en `null` hasta disponer de un dato o método de cálculo documentado.
- `urlOficial`, `fuente` y `fechaRevision`: trazabilidad de la comprobación.
- `estadoValidacion`: `pendiente`, `revisado`, `validado` o `descatalogado`.

El campo histórico `consumo` continúa alimentando los cálculos actuales. No debe interpretarse todavía como consumo nominal confirmado.

## Importar el Excel maestro

Con Excel cerrado y desde la raíz del proyecto:

```bash
npm run catalog:import -- "C:/ruta/Catalogo maestro Illusion Rack Designer - 32 productos.xlsx"
```

El importador:

1. exige la hoja `Catálogo maestro` y las columnas profesionales;
2. rechaza la columna eliminada `SKU fabricante`;
3. verifica los 32 IDs, duplicados, ausentes y desconocidos;
4. valida números, URL, fecha, estado y código ODDO;
5. permite `XXXXX` mientras el código ODDO esté pendiente;
6. genera `professionalCatalog.json` en el orden oficial;
7. no modifica las reglas técnicas del rack.

Después deben ejecutarse `npm test`, `npm run lint` y `npm run build`. Guardar el Excel por sí solo no ejecuta esta importación.
