import { v4 as uuid } from 'uuid'

type AccountData = {
  name?: string
  email?: string
  password?: string
}
type FacebookData = {
  name: string
  email: string
  facebookId: string
}
export class UserAccount {
  id: string
  name: string
  email: string
  password?: string
  facebookId: string
  constructor (fbData: FacebookData, accountData?: AccountData) {
    this.id = uuid()
    this.name = accountData?.name ?? fbData.name
    this.email = accountData?.email ?? fbData.email
    this.password = accountData?.password
    this.facebookId = fbData.facebookId
  }
}
