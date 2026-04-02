import { mapFormToLifeProfile } from './life-profile.mapper';

describe('mapFormToLifeProfile', () => {
  it('maps form value to API model correctly', () => {
    const formValue = {
      firstName: '  Alex ',
      lastName: ' Doe ',
      age: 42,
      preferredRole: 'member' as const,
    };

    const mapped = mapFormToLifeProfile(formValue);

    expect(mapped).toEqual(
      expect.objectContaining({
        userId: 'demo-user',
        firstName: 'Alex',
        lastName: 'Doe',
        age: 42,
        preferredRole: 'member',
        roles: ['member'],
        schedule: {},
        priorities: [],
        frictionPoints: [],
        habitAnchors: [],
        status: 'active',
        privacy: 'private',
      }),
    );
  });
});
