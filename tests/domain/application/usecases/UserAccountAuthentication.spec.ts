import { UserAccountAuthentication } from '@/application/usecases/users/UserAccountAuthentication'
import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto/Token'
import { RepositoryFactory } from '@/domain/contracts/factory'
import { SaveUserAccountRepository, UserAccountRepository } from '@/domain/contracts/repository'
import { AuthenticationError } from '@/domain/entities/errors'

import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'
import { AccessToken, UserAccount } from '@/domain/entities'

jest.mock('@/domain/entities/UserAccount')

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
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
    userAccountRepositoryFactory = mock()
    userAccountRepository = mock()
    userAccountRepositoryFactory.makeUserAccountRepository.mockReturnValue(userAccountRepository)
    userAccountRepository.loadAccount.mockResolvedValue(undefined)
    userAccountRepository.saveAccount.mockResolvedValue({ id: 'any_account_id' })
    sut = new UserAccountAuthentication(facebookApi, crypto, userAccountRepositoryFactory)
  })
  describe('Login with Facebook or create an account', () => {
    it('should call LoadFacebookUserApi with correct params', async () => {
      await sut.execute({ token })
      expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
      expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
    })
    it('should throw AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
      facebookApi.loadUser.mockResolvedValueOnce(undefined)
      const promise = sut.execute({ token })
      await expect(promise).rejects.toThrow(new AuthenticationError())
    })
    it('should call UserAccountRepository returns LoadFacebookUserApi returns data', async () => {
      await sut.execute({ token })
      expect(userAccountRepository.loadAccount).toHaveBeenCalledWith({ email: 'any_facebook_email' })
      expect(userAccountRepository.loadAccount).toHaveBeenCalledTimes(1)
    })
    it('should call SaveAccount with FacebookAccount', async () => {
      const FacebookAccountStub = jest.fn().mockImplementation(() => ({
        name: 'any_facebook_name',
        email: 'any_facebook_email',
        facebookId: 'any_facebook_id'
      }))
      mocked(UserAccount).mockImplementation(FacebookAccountStub)
      await sut.execute({ token })
      expect(userAccountRepository.saveAccount).toHaveBeenCalledWith({
        name: 'any_facebook_name',
        email: 'any_facebook_email',
        facebookId: 'any_facebook_id'
      })
      expect(userAccountRepository.saveAccount).toHaveBeenCalledTimes(1)
    })
    it('should call TokenGenerator with correct params', async () => {
      await sut.execute({ token })
      expect(crypto.generateToken).toHaveBeenCalledWith({
        key: 'any_account_id',
        expirationInMs: AccessToken.expirationInMs
      })
      expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    })
    it('should return an AccessToken on success', async () => {
      const authResult = await sut.execute({ token })
      expect(authResult).toEqual({ accessToken: 'any_generated_token' })
    })
    it('should throw if LoadUserAccountRepository throws', async () => {
      userAccountRepository.loadAccount.mockRejectedValueOnce(new Error('load_error'))
      const promise = sut.execute({ token })
      await expect(promise).rejects.toThrow(new Error('load_error'))
    })
    it('should throw if SaveUserAccountRepository throws', async () => {
      userAccountRepository.saveAccount.mockRejectedValueOnce(new Error('save_error'))
      const promise = sut.execute({ token })
      await expect(promise).rejects.toThrow(new Error('save_error'))
    })
    it('should throw if TokenGeneraTor throws', async () => {
      crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
      const promise = sut.execute({ token })
      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })
  describe('Login or create an account with email and password', () => {
    it('should call TokenGenerator if an account exists', async () => {
      userAccountRepository.loadAccount.mockResolvedValueOnce({
        id: 'any_account_id',
        name: 'any_account_name',
        email: 'any_account_email',
        password: 'any_account_password'
      })
      const FacebookAccountStub = jest.fn().mockImplementationOnce(() => ({
        id: 'any_account_id',
        name: 'any_account_name',
        email: 'any_account_email',
        password: 'any_account_password'
      }))
      mocked(UserAccount).mockImplementationOnce(FacebookAccountStub)
      await sut.execute({ email: 'any_account_email', password: 'any_account_password' })
      expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id', expirationInMs: AccessToken.expirationInMs })
      expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    })
    it('should return an AccessToken if an account exists', async () => {
      userAccountRepository.loadAccount.mockResolvedValueOnce({
        id: 'any_account_id',
        name: 'any_account_name',
        email: 'any_account_email',
        password: 'any_account_password'
      })
      const FacebookAccountStub = jest.fn().mockImplementationOnce(() => ({
        id: 'any_account_id',
        name: 'any_account_name',
        email: 'any_account_email',
        password: 'any_account_password'
      }))
      mocked(UserAccount).mockImplementationOnce(FacebookAccountStub)
      const authResult = await sut.execute({ email: 'any_account_email', password: 'any_account_password' })
      expect(authResult).toEqual({ accessToken: 'any_generated_token' })
    })
    it('should throw if password does not match', async () => {
      userAccountRepository.loadAccount.mockResolvedValueOnce({
        id: 'any_account_id',
        name: 'any_account_name',
        email: 'any_account_email',
        password: 'any_account_password'
      })
      const FacebookAccountStub = jest.fn().mockImplementationOnce(() => ({
        id: 'any_account_id',
        name: 'any_account_name',
        email: 'any_account_email',
        password: 'any_account_password'
      }))
      mocked(UserAccount).mockImplementationOnce(FacebookAccountStub)
      const promise = sut.execute({ email: 'any_account_email', password: 'any_account_password2', name: 'any_account_name' })
      await expect(promise).rejects.toThrow(new AuthenticationError())
    })
    it('should throws if accountData does not exists and a name is not provided', async () => {
      const promise = sut.execute({ email: 'any_account_email', password: 'any_account_password' })
      await expect(promise).rejects.toThrow(new AuthenticationError())
    })
    it('should create a new user when email, name and password is provided', async () => {
      const authResult = await sut.execute({ email: 'any_account_email', password: 'any_account_password', name: 'any_account_name' })
      expect(authResult).toEqual({ accessToken: 'any_generated_token' })
    })
    // it('should call saveAccount with email and password and name', async () => {
    //   const FacebookAccountStub = jest.fn().mockImplementationOnce(() => ({
    //     id: 'any_account_id',
    //     name: 'any_account_name',
    //     email: 'any_account_email',
    //     password: 'any_account_password'
    //   }))
    //   mocked(UserAccount).mockImplementationOnce(FacebookAccountStub)
    //   await sut.execute({ email: 'any_account_email', password: 'any_account_password', name: 'any_account_name' })
    //   expect(userAccountRepository.saveAccount).toHaveBeenCalledWith({
    //     id: 'any_account_id',
    //     name: 'any_account_name',
    //     email: 'any_account_email',
    //     password: 'any_account_password'
    //   })
    //   expect(userAccountRepository.saveAccount).toHaveBeenCalledTimes(1)
    // })
    // it('should throw if saveAccount throws', async () => {
    //   const promise = sut.execute({ email: 'any_account_email', password: 'any_account_password' })
    //   await expect(promise).rejects.toThrow(new AuthenticationError())
    //   // expect(userAccountRepository.saveAccount).toHaveBeenCalledTimes(1)
    // })
    // it('should call TokenGenerator with correct params', async () => {
    //   await sut.execute({ email: 'any_account_email', password: 'any_account_password', name: 'any_account_name' })
    //   expect(crypto.generateToken).toHaveBeenCalledWith({
    //     key: 'any_account_id',
    //     expirationInMs: AccessToken.expirationInMs
    //   })
    //   expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    // })
    // it('should return an AccessToken if user exists', async () => {
    //   userAccountRepository.loadAccount.mockResolvedValueOnce({
    //     id: 'any_account_id',
    //     name: 'any_account_name',
    //     email: 'any_account_email',
    //     password: 'any_account_password'
    //   })
    //   userAccountRepository.saveAccount.mockResolvedValueOnce({ id: 'any_account_id' })
    //   const authResult = await sut.execute({ email: 'any_account_email', password: 'any_account_password', name: 'any_account_name' })
    //   expect(authResult).toEqual({ accessToken: 'any_generated_token' })
    // })
  })
})
