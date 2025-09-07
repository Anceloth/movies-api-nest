export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_MESSAGES = {
  SUCCESS: 'Success',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  CONFLICT: 'Resource already exists',
  INTERNAL_ERROR: 'Internal server error',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please provide a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters long',
} as const;
