import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto/Token'
import { RepositoryFactory } from '@/domain/contracts/factory'
import { UserAccountRepository, SaveUserAccountRepository } from '@/domain/contracts/repository'
import { AccessToken, UserAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

type Params = {
  token?: string
  email?: string
  name?: string
  password?: string
}
export interface UserAccountFacebookAuthentication {
  execute (params: Params): Promise<{ accessToken: string }>
}

export class UserAccountAuthentication implements UserAccountFacebookAuthentication {
  private readonly userAccountRepository: UserAccountRepository & SaveUserAccountRepository
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly crypto: TokenGenerator,
    private readonly userAccountRepositoryFactory: RepositoryFactory
  ) {
    this.userAccountRepository = userAccountRepositoryFactory.makeUserAccountRepository()
  }

  async execute (params: Params): Promise<{ accessToken: string }> {
    if (params.token !== undefined) {
      return await this.createFacebookAccount(params)
    }
    if ((params.email !== undefined && params.password !== undefined)) {
      return await this.getAccountOrCreateIfNotExists(params)
    }
    throw new AuthenticationError()
  }

  private async createFacebookAccount (params: Params): Promise<{ accessToken: string }> {
    const fbData = await this.facebookApi.loadUser({ token: params.token! })
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.loadAccount({ email: fbData.email })
      const userAccount = new UserAccount(fbData, accountData)
      const id = await this.persistAccount(userAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return { accessToken: token }
    }
    throw new AuthenticationError()
  }

  private async getAccountOrCreateIfNotExists (params: Params): Promise<{ accessToken: string }> {
    const accountData = await this.userAccountRepository.loadAccount({ email: params.email! })
    const userAccount = new UserAccount({} as any, accountData)
    let token: string | null = null
    if (accountData !== undefined) {
      if (userAccount.password === params.password) {
        token = await this.crypto.generateToken({ key: userAccount.id, expirationInMs: AccessToken.expirationInMs })
        return { accessToken: token }
      }
      throw new AuthenticationError()
    }
    if (params.name === undefined) {
      throw new AuthenticationError()
    }
    const id = await this.persistAccount(userAccount)
    token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken: token }
  }

  private async persistAccount (userAccount: UserAccount): Promise<string> {
    const { id } = await this.userAccountRepository.saveAccount({
      id: userAccount.id,
      name: userAccount.name,
      email: userAccount.email,
      password: userAccount.password,
      facebookId: userAccount.facebookId
    })
    return id
  }
}
