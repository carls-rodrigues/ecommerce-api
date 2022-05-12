import { randomUUID } from 'crypto';
import { BaseEntity } from '../../../src/domain/entities/Base';

describe('BaseEntity', () => {
  it('should throw if invalid id is provided', () => {
    expect(() =>
      BaseEntity.validate('invalid_id', 'valid name', 'valid_mail@mail.com'),
    ).toThrow(new Error('This id is not a valid UUID'));
  });
  it('should throw if invalid email is provided', () => {
    expect(() =>
      BaseEntity.validate(randomUUID(), 'invalid_name', 'valid_mail@mail.com'),
    ).toThrow(new Error('This name is not valid'));
  });
  it('should throw if invalid email is provided', () => {
    expect(() =>
      BaseEntity.validate(randomUUID(), 'valid name', 'invalid_mail'),
    ).toThrow(new Error('Invalid email'));
  });
  it('should return true if all data is valid', () => {
    const sut = BaseEntity.validate(
      randomUUID(),
      'valid name',
      'valid_mail@mail.com',
    );
    expect(sut).toBe(true);
  });
});
