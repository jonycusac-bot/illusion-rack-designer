const findDuplicates = ids => ids.filter((id, index) => ids.indexOf(id) !== index);

export const mergeProfessionalCatalog = (technicalCatalog, professionalRows) => {
  const technicalIds = technicalCatalog.map(item => item.id);
  const professionalIds = professionalRows.map(item => item.id);
  const technicalSet = new Set(technicalIds);
  const professionalSet = new Set(professionalIds);
  const missing = technicalIds.filter(id => !professionalSet.has(id));
  const unknown = professionalIds.filter(id => !technicalSet.has(id));
  const duplicated = findDuplicates(professionalIds);

  if (missing.length || unknown.length || duplicated.length) {
    throw new Error(`IDs profesionales no coinciden. Faltan: ${missing.join(', ') || 'ninguno'}. Desconocidos: ${unknown.join(', ') || 'ninguno'}. Duplicados: ${duplicated.join(', ') || 'ninguno'}.`);
  }

  const professionalById = new Map(professionalRows.map(({ id, ...professional }) => [id, professional]));
  return technicalCatalog.map(item => Object.freeze({
    ...item,
    datosProfesionales: Object.freeze(professionalById.get(item.id)),
  }));
};
