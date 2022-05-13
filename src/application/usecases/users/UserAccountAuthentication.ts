import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto/Token'
import { RepositoryFactory } from '@/domain/contracts/factory'
import { UserAccountRepository, SaveUserAccountRepository } from '@/domain/contracts/repository'
import { AccessToken, UserAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

type Params = {
  token?: string
  email?: string
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
      const fbData = await this.facebookApi.loadUser({ token: params.token })
      if (fbData !== undefined) {
        const accountData = await this.userAccountRepository.loadAccount({ email: fbData.email })
        const userAccount = new UserAccount(fbData, accountData)
        const { id } = await this.userAccountRepository.saveAccount({
          id: userAccount.id,
          name: userAccount.name,
          email: userAccount.email,
          facebookId: userAccount.facebookId
        })
        const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
        return { accessToken: token }
      }
    }
    if (params.email !== undefined && params.password !== undefined) {
      const accountData = await this.userAccountRepository.loadAccount({ email: params.email })
      if (accountData === undefined) {
        const userAccount = new UserAccount({} as any, accountData)
        await this.userAccountRepository.saveAccount({
          id: userAccount.id,
          name: userAccount.name,
          email: userAccount.email,
          password: userAccount.password
        })
        return { accessToken: 'tmp_token' }
      }
    }
    throw new AuthenticationError()
  }
}
