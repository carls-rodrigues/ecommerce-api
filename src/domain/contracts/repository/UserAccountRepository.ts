export interface UserAccountRepository {
  loadAccount(
    params: UserAccountRepository.Params,
  ): Promise<UserAccountRepository.Result>
}

export namespace UserAccountRepository {
  export type Params = {
    email: string
  }
  export type Result = undefined | {
    id: string
    name?: string
    email: string
    password?: string
    facebookId?: string
  }
}

export interface SaveUserAccountRepository {
  saveAccount(params: SaveUserAccountRepository.Params): Promise<SaveUserAccountRepository.Result>
}

export namespace SaveUserAccountRepository {
  export type Params = {
    id: string
    name: string
    email: string
    password?: string
    facebookId: string
  }
  export type Result = {
    id: string
  }
}
