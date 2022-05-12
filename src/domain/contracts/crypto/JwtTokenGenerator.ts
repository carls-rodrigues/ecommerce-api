import { TokenGenerator } from './Token'

import { sign } from 'jsonwebtoken'

type Params = TokenGenerator.Params

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}
  async generateToken ({ key, expirationInMs }: Params): Promise<string> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
