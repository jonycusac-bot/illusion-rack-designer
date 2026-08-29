export const EQUIPMENT_REVIEW_ENDPOINT = 'https://formsubmit.co/ajax/jonycusac@gmail.com';

export const buildEquipmentReviewPayload = (equipment, user = null) => ({
  _subject: `[Illusion Rack Designer] Propuesta: ${equipment.nombre || `${equipment.fabricante} ${equipment.modelo}`}`,
  _template: 'table',
  _captcha: 'false',
  email: user?.email || '',
  remitente: user?.displayName || user?.email || 'Usuario sin sesión',
  identificador_usuario: user?.uid || 'invitado',
  fabricante: equipment.fabricante || 'No indicado',
  modelo: equipment.modelo || 'No indicado',
  nombre_producto: equipment.nombre || 'No indicado',
  categoria: equipment.categoria || 'Otros',
  url_oficial: equipment.urlProducto || 'No indicada',
  montaje_en_rack: equipment.esRackable ? 'Sí' : 'No',
  altura_rack: `${equipment.uOcupadas || 1}U`,
  profundidad: `${equipment.fondo || 0} mm`,
  peso: `${equipment.pesoKg || 0} kg`,
  consumo_declarado: `${equipment.consumo || 0} W`,
  notas: equipment.notas || 'Sin notas',
  estado: 'Pendiente de revisión manual',
  aviso: 'Esta propuesta no se incorpora automáticamente al catálogo.'
});

export const submitEquipmentForReview = async (equipment, user = null, request = fetch) => {
  let response;
  try {
    response = await request(EQUIPMENT_REVIEW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(buildEquipmentReviewPayload(equipment, user))
    });
  } catch {
    throw new Error('No se pudo conectar con el servicio de correo.');
  }

  let result = {};
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok || result.success === false || result.success === 'false') {
    throw new Error('No se pudo enviar la solicitud de revisión.');
  }

  return result;
};
