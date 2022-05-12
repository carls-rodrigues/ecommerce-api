export abstract class BaseEntity {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  constructor(
    id: string,
    name: string,
    email: string,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
  static validate(id: string, name: string, email: string): boolean {
    const isIdValid = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    if (!isIdValid.test(id)) throw new Error('This id is not a valid UUID');
    const isNameValid = /^[a-z ,.'-]+$/i;
    if (!isNameValid.test(name)) throw new Error('This name is not valid');
    const isEmailValid = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    if (!isEmailValid.test(email)) throw new Error('Invalid email');
    return true;
  }
}
