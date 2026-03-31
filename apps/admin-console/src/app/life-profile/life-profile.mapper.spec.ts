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

    expect(mapped).toEqual({
      firstName: 'Alex',
      lastName: 'Doe',
      age: 42,
      preferredRole: 'member',
    });
  });
});
