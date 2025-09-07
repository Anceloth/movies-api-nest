import { IsEmail, IsString, MinLength, IsBoolean, IsOptional, IsUUID, IsDate, validate } from 'class-validator';
import { DomainValidationException } from '../exceptions/domain-validation.exception';

// Domain Entity - Pure business logic, no infrastructure dependencies
export class User {
  @IsUUID()
  public readonly id: string;

  @IsEmail({}, { message: 'Invalid email format' })
  public readonly email: string;

  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  public readonly firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  public readonly lastName: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  private _password: string;

  @IsBoolean({ message: 'isActive must be a boolean' })
  public readonly isActive: boolean;

  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  public readonly avatar?: string;

  @IsDate({ message: 'createdAt must be a valid date' })
  public readonly createdAt: Date;

  @IsDate({ message: 'updatedAt must be a valid date' })
  public readonly updatedAt: Date;

  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    isActive: boolean = true,
    avatar?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this._password = password;
    this.isActive = isActive;
    this.avatar = avatar;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business logic methods
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get password(): string {
    return this._password;
  }

  // Validate the entire entity using class-validator
  async validate(): Promise<string[]> {
    const errors = await validate(this);
    return errors.flatMap(error => 
      error.constraints ? Object.values(error.constraints) : []
    );
  }

  // Check if the entity is valid
  async isValid(): Promise<boolean> {
    const errors = await this.validate();
    return errors.length === 0;
  }


  // Factory method for creating new users
  static async create(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    avatar?: string,
  ): Promise<User> {
    const user = new User(id, email, firstName, lastName, password, true, avatar);
    
    const errors = await user.validate();
    if (errors.length > 0) {
      throw new DomainValidationException(errors);
    }

    return user;
  }
}
