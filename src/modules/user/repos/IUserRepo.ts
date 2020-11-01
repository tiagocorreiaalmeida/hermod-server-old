import { Repo } from '../../../shared/repo/Repo';
import { User } from '../domain/User';

export interface IUserRepo extends Repo<User> {
  findUserById: (id: string) => Promise<User | null>;
  findUserByEmail: (email: string) => Promise<User | null>;
  exists: (user: User) => Promise<boolean>;
  save: (user: User) => Promise<void>;
}
