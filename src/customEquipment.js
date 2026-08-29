export const parseStoredCustomEquipment = (rawValue) => {
  try {
    const parsed = JSON.parse(rawValue || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const normalizeCustomEquipment = (equipment, id = `custom_${Date.now()}`) => {
  const fabricante = equipment.fabricante.trim();
  const modelo = equipment.modelo.trim();
  const uOcupadas = Math.max(1, Number(equipment.uOcupadas) || 1);
  return {
    id,
    nombre: equipment.nombre?.trim() || `${fabricante} ${modelo}`,
    fabricante,
    modelo,
    categoria: equipment.categoria || 'Otros',
    esRackable: Boolean(equipment.esRackable),
    uOcupadas,
    altura: uOcupadas * 44.45,
    fondo: Math.max(0, Number(equipment.fondo) || 0),
    consumo: Math.max(0, Number(equipment.consumo) || 0),
    ancho: equipment.esRackable ? 'completo' : (equipment.ancho || 'media'),
    requiereTapaCiega: !equipment.esRackable && Boolean(equipment.requiereTapaCiega),
    requiereEscobilla: Boolean(equipment.requiereEscobilla),
    requierePlacaCiega: Boolean(equipment.requierePlacaCiega),
    incluyeOrejasRack: Boolean(equipment.incluyeOrejasRack),
    pesoKg: Math.max(0, Number(equipment.pesoKg) || 0),
    urlProducto: equipment.urlProducto?.trim() || '',
    notas: equipment.notas?.trim() || '',
    esPersonalizado: true,
    origen: 'personalizado',
    verificado: false
  };
};

export const validateCustomEquipment = (equipment) => {
  const errors = {};
  if (!equipment.fabricante?.trim()) errors.fabricante = 'Indica el fabricante.';
  if (!equipment.modelo?.trim()) errors.modelo = 'Indica el modelo.';
  if (equipment.urlProducto?.trim()) {
    try {
      const parsedUrl = new URL(equipment.urlProducto.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('invalid protocol');
    } catch {
      errors.urlProducto = 'Introduce una URL completa que empiece por http:// o https://.';
    }
  }
  const uOcupadas = Number(equipment.uOcupadas);
  const fondo = Number(equipment.fondo);
  const consumo = Number(equipment.consumo);
  if (equipment.esRackable && (!Number.isFinite(uOcupadas) || uOcupadas < 1 || uOcupadas > 20)) {
    errors.uOcupadas = 'Indica una altura entre 1U y 20U.';
  }
  if (Number.isFinite(fondo) && fondo < 0) errors.fondo = 'La profundidad no puede ser negativa.';
  if (Number.isFinite(consumo) && consumo < 0) errors.consumo = 'El consumo no puede ser negativo.';
  return errors;
};
