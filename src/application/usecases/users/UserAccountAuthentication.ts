import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { TokenGenerator } from '@/domain/contracts/crypto/Token'
import { RepositoryFactory } from '@/domain/contracts/factory'
import { UserAccountRepository, SaveUserAccountRepository } from '@/domain/contracts/repository'

type Params = {
  token?: string
  email?: string
  password?: string
}
export interface UserAccountFacebookAuthentication {
  execute (params: Params): Promise<{ accessToken: string }>
}

export class UserAccountAuthentication {
  private readonly userAccountRepository: UserAccountRepository & SaveUserAccountRepository
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly crypto: TokenGenerator,
    private readonly userAccountRepositoryFactory: RepositoryFactory
  ) {
    this.userAccountRepository = userAccountRepositoryFactory.makeUserAccountRepository()
  }

  async execute (params: Params): Promise<void> {
    if (params.token !== undefined) {
      await this.facebookApi.loadUser({ token: params.token })
    }
    if (params.email !== undefined && params.password !== undefined) { // local login
      await this.userAccountRepository.loadAccount({ email: params.email })
    }
  }
}
