export interface TokenGenerator {
  generateToken (params: TokenGenerator.Params): Promise<string>
}
export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }
}
