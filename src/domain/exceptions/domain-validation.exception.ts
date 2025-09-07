// Domain Exception - Pure domain exception without framework dependencies
export class DomainValidationException extends Error {
  public readonly validationErrors: string[];

  constructor(validationErrors: string[]) {
    super(validationErrors.join(', '));
    this.name = 'DomainValidationException';
    this.validationErrors = validationErrors;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainValidationException);
    }
  }
}
