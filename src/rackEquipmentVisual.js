export const getRackVisualSegments = (equipment) => {
  const distribution = equipment.distribucionVisualRack;
  if (!distribution) {
    return [{ type: 'equipment', u: equipment.uOcupadas || 1 }];
  }

  const segments = [
    { type: 'support', u: distribution.soporteSuperiorU },
    { type: 'equipment', u: distribution.equipoU },
    { type: 'support', u: distribution.soporteInferiorU }
  ];
  const totalVisualU = segments.reduce((total, segment) => total + segment.u, 0);
  const occupiedU = equipment.uOcupadas || 1;

  return totalVisualU === occupiedU
    ? segments
    : [{ type: 'equipment', u: occupiedU }];
};
