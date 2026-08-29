export const OFFICIAL_CATALOG_CATEGORIES = Object.freeze([
  'Audio',
  'Video',
  'Control',
  'Redes',
  'Cinema',
  'Energía',
  'Otros',
  'Accesorios',
]);

const isNonNegativeNumber = value => Number.isFinite(value) && value >= 0;
const isNullableNonNegativeNumber = value => value === null || isNonNegativeNumber(value);
const VALID_VALIDATION_STATES = ['pendiente', 'revisado', 'validado', 'descatalogado'];

export const validateOfficialCatalog = catalog => {
  const errors = [];
  const ids = new Set();

  if (!Array.isArray(catalog)) return ['El catálogo oficial debe ser una lista.'];

  catalog.forEach((item, index) => {
    const path = item?.id || `posición ${index}`;

    if (!item?.id || typeof item.id !== 'string') {
      errors.push(`${path}: falta un ID válido.`);
    } else if (ids.has(item.id)) {
      errors.push(`${path}: ID duplicado.`);
    } else {
      ids.add(item.id);
    }

    if (!item?.nombre || typeof item.nombre !== 'string') errors.push(`${path}: falta el nombre.`);
    if (!OFFICIAL_CATALOG_CATEGORIES.includes(item?.categoria)) errors.push(`${path}: categoría no válida.`);
    if (!isNonNegativeNumber(item?.altura)) errors.push(`${path}: altura no válida.`);
    if (!isNonNegativeNumber(item?.fondo)) errors.push(`${path}: profundidad no válida.`);
    if (!isNonNegativeNumber(item?.consumo)) errors.push(`${path}: consumo no válido.`);
    if (typeof item?.esRackable !== 'boolean') errors.push(`${path}: esRackable debe ser booleano.`);
    if (item?.uOcupadas !== undefined && (!Number.isInteger(item.uOcupadas) || item.uOcupadas < 1)) {
      errors.push(`${path}: uOcupadas no válida.`);
    }

    if (item?.distribucionVisualRack) {
      const { soporteSuperiorU = 0, equipoU = 0, soporteInferiorU = 0 } = item.distribucionVisualRack;
      const totalVisualU = soporteSuperiorU + equipoU + soporteInferiorU;
      const reservedU = item.uOcupadas || Math.ceil(item.altura / 44.45);
      if (totalVisualU !== reservedU) errors.push(`${path}: la distribución visual no coincide con las U reservadas.`);
    }

    if (!item?.datosProfesionales) {
      errors.push(`${path}: falta la ficha profesional.`);
    } else {
      const professional = item.datosProfesionales;
      if (typeof professional.fabricante !== 'string') errors.push(`${path}: fabricante profesional no válido.`);
      if (typeof professional.modelo !== 'string') errors.push(`${path}: modelo profesional no válido.`);
      if (typeof professional.codigoODDO !== 'string' || !professional.codigoODDO.trim()) errors.push(`${path}: código ODDO no válido.`);
      if (!isNullableNonNegativeNumber(professional.pesoKg)) errors.push(`${path}: peso profesional no válido.`);
      if (!isNullableNonNegativeNumber(professional.consumoNominalW)) errors.push(`${path}: consumo nominal no válido.`);
      if (!isNullableNonNegativeNumber(professional.consumoMaximoW)) errors.push(`${path}: consumo máximo no válido.`);
      if (!isNullableNonNegativeNumber(professional.cargaTermicaW)) errors.push(`${path}: carga térmica no válida.`);
      if (professional.urlOficial !== null && typeof professional.urlOficial !== 'string') errors.push(`${path}: URL oficial no válida.`);
      if (professional.fuente !== null && typeof professional.fuente !== 'string') errors.push(`${path}: fuente no válida.`);
      if (professional.fechaRevision !== null && typeof professional.fechaRevision !== 'string') errors.push(`${path}: fecha de revisión no válida.`);
      if (!VALID_VALIDATION_STATES.includes(professional.estadoValidacion)) errors.push(`${path}: estado de validación no válido.`);
      if (professional.notas !== null && typeof professional.notas !== 'string') errors.push(`${path}: notas no válidas.`);
    }
  });

  return errors;
};
