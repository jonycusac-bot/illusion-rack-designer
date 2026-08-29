const MINIMUM_EXPANSION_U = 2;
const INTERMEDIATE_FAN_THRESHOLD_U = 24;

export const calculateRackCapacity = (baseOccupiedU, commercialRacks) => {
  const findRack = (requiredU) =>
    commercialRacks.find(rackU => rackU >= requiredU) || commercialRacks.at(-1);

  const initialRack = findRack(baseOccupiedU + MINIMUM_EXPANSION_U);
  const intermediateFanU = initialRack > INTERMEDIATE_FAN_THRESHOLD_U ? 1 : 0;
  const occupiedU = baseOccupiedU + intermediateFanU;
  const rackRecommended = findRack(occupiedU + MINIMUM_EXPANSION_U);
  const expansionU = Math.max(0, rackRecommended - occupiedU);

  return {
    rackRecommended,
    occupiedU,
    intermediateFanU,
    expansionU,
    extraBlankPlates: expansionU
  };
};
