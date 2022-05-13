import { SaveUserAccountRepository, UserAccountRepository } from '../repository/UserAccountRepository'

export interface RepositoryFactory {
  makeUserAccountRepository(): UserAccountRepository & SaveUserAccountRepository
}
