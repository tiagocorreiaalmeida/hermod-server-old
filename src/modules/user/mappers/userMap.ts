import { Mapper } from '../../../shared/infra/Mapper';
import { User } from '../domain/user';
import { UserDTO } from '../dtos/userDTO';

export class UserMap implements Mapper<User> {
  static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
