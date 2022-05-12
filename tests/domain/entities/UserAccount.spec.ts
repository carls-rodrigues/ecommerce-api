import { UserAccount } from '@/domain/entities/';

describe('UserAccount', () => {
  const fbData = {
    name: 'any_facebook_name',
    email: 'any_facebook_email',
    facebookId: 'any_facebookId',
  };
  it('should create with facebook data only', () => {
    const sut = new UserAccount(fbData);
    expect(sut).toEqual({
      id: sut.id,
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebookId',
      password: undefined,
    });
  });
  it('should update name if its not empty', () => {
    const accountData = {
      name: 'any_name',
      password: 'any_password',
    };
    const sut = new UserAccount(fbData, accountData);
    expect(sut).toEqual({
      id: sut.id,
      name: 'any_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebookId',
      password: 'any_password',
    });
  });
});
