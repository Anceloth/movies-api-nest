import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserMapper {
  // Convert from Domain Entity to Infrastructure Model
  static toPersistence(user: User): UserModel {
    const userModel = new UserModel();
    userModel.id = user.id;
    userModel.email = user.email;
    userModel.firstName = user.firstName;
    userModel.lastName = user.lastName;
    userModel.password = user.password;
    userModel.isActive = user.isActive;
    userModel.avatar = user.avatar;
    userModel.createdAt = user.createdAt;
    userModel.updatedAt = user.updatedAt;
    return userModel;
  }

  // Convert from Infrastructure Model to Domain Entity
  static toDomain(userModel: UserModel): User {
    return new User(
      userModel.id,
      userModel.email,
      userModel.firstName,
      userModel.lastName,
      userModel.password,
      userModel.isActive,
      userModel.avatar,
      userModel.createdAt,
      userModel.updatedAt,
    );
  }

  // Convert array of models to domain entities
  static toDomainArray(userModels: UserModel[]): User[] {
    return userModels.map(userModel => this.toDomain(userModel));
  }

  // Convert array of domain entities to models
  static toPersistenceArray(users: User[]): UserModel[] {
    return users.map(user => this.toPersistence(user));
  }
}
