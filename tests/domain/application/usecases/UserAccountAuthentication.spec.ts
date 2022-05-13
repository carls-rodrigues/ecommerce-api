import { UserAccountAuthentication } from '@/application/usecases/users/UserAccountAuthentication'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto/Token'
import { RepositoryFactory } from '@/domain/contracts/factory'
import { SaveUserAccountRepository, UserAccountRepository } from '@/domain/contracts/repository'
import { AuthenticationError } from '@/domain/entities/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('UserAccountAuthentication', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepositoryFactory: MockProxy<RepositoryFactory>
  let userAccountRepository: MockProxy<SaveUserAccountRepository & UserAccountRepository>
  let sut: UserAccountAuthentication
  let token: string
  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
  })
  beforeEach(() => {
    facebookApi = mock()
    crypto = mock()
    userAccountRepositoryFactory = mock()
    userAccountRepository = mock()
    userAccountRepositoryFactory.makeUserAccountRepository.mockReturnValue(userAccountRepository)
    userAccountRepository.loadAccount.mockResolvedValue(undefined)
    sut = new UserAccountAuthentication(facebookApi, crypto, userAccountRepositoryFactory)
  })
  it('should call LoadFacebookUserApi with correct params', async () => {
    facebookApi.loadUser.mockResolvedValueOnce({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
    await sut.execute({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('should throw AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValue(undefined)
    const promise = sut.execute({ token })
    await expect(promise).rejects.toThrow(new AuthenticationError())
  })
})
