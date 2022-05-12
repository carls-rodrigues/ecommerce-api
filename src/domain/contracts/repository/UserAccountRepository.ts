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
  }
}

export interface SaveUserAccountRepository {
  saveAccount(params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result>
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    name: string
    email: string
    password?: string
    facebookId: string
  }
  export type Result = {
    id: string
  }
}
