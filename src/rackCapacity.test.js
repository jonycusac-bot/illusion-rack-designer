import { describe, expect, it } from 'vitest';
import { calculateRackCapacity } from './rackCapacity.js';

const commercialRacks = [9, 15, 20, 24, 33, 42, 47];

describe('calculateRackCapacity', () => {
  it('keeps at least 2U available for future expansion', () => {
    expect(calculateRackCapacity(7, commercialRacks)).toEqual({
      rackRecommended: 9,
      occupiedU: 7,
      intermediateFanU: 0,
      expansionU: 2,
      extraBlankPlates: 2
    });
  });

  it('selects the next commercial rack when only 1U would remain', () => {
    expect(calculateRackCapacity(8, commercialRacks)).toMatchObject({
      rackRecommended: 15,
      occupiedU: 8,
      expansionU: 7,
      extraBlankPlates: 7
    });
  });

  it('counts the intermediate fan in racks larger than 24U', () => {
    expect(calculateRackCapacity(23, commercialRacks)).toEqual({
      rackRecommended: 33,
      occupiedU: 24,
      intermediateFanU: 1,
      expansionU: 9,
      extraBlankPlates: 9
    });
  });

  it('fills every unused unit with one removable extra blank plate', () => {
    const capacity = calculateRackCapacity(2, commercialRacks);
    expect(capacity.rackRecommended).toBe(9);
    expect(capacity.extraBlankPlates).toBe(7);
    expect(capacity.occupiedU + capacity.extraBlankPlates).toBe(capacity.rackRecommended);
  });
});
