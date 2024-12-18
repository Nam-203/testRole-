export class DatabaseError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }

  static isUniqueConstraintViolation(error: any): boolean {
    return error.code === '23505' || error.code === 'ER_DUP_ENTRY';
  }
}
