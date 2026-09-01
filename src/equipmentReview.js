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

export const buildEquipmentReviewMailtoLink = (equipment, user = null) => {
  const subject = encodeURIComponent(`[Illusion Rack Designer] Propuesta: ${equipment.nombre || `${equipment.fabricante} ${equipment.modelo}`}`);
  const body = encodeURIComponent(`Propuesta de nuevo equipo para revisión técnica en Illusion Rack Designer:

• Fabricante: ${equipment.fabricante || 'No indicado'}
• Modelo: ${equipment.modelo || 'No indicado'}
• Nombre de producto: ${equipment.nombre || 'No indicado'}
• Categoría: ${equipment.categoria || 'Otros'}
• Montaje en Rack: ${equipment.esRackable ? 'Sí' : 'No'} (${equipment.uOcupadas || 1}U)
• Dimensiones: ${equipment.fondo || 0} mm profundidad | Peso: ${equipment.pesoKg || 0} kg
• Consumo declarado: ${equipment.consumo || 0} W
• URL Oficial: ${equipment.urlProducto || 'No indicada'}
• Notas / Observaciones: ${equipment.notas || 'Sin notas'}

Enviado por: ${user?.displayName || user?.email || 'Usuario de la app'} (${user?.email || 'Sin correo'})`);

  return `mailto:jonycusac@gmail.com?subject=${subject}&body=${body}`;
};

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

  const isSuccess = response.ok && (result.success === true || result.success === 'true');

  if (!isSuccess) {
    if (result.message && /activat/i.test(result.message)) {
      const activationError = new Error('Revisa tu correo jonycusac@gmail.com y pulsa "Activate Form" para activar el buzón de FormSubmit.');
      activationError.needsActivation = true;
      throw activationError;
    }
    throw new Error(result.message || 'No se pudo enviar la solicitud de revisión.');
  }

  return result;
};
