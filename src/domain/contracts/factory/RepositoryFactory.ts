import { UserAccountRepository } from '../repository/UserAccountRepository'

export interface RepositoryFactory {
  makeUserAccountRepository(): UserAccountRepository
}
