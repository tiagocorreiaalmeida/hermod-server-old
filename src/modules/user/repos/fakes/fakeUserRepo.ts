import { FakeRepo } from '../../../../shared/repo/FakeRepo';
import { User } from '../../domain/User';
import { IUserRepo } from '../IUserRepo';

export class FakeUserRepo extends FakeRepo<User> implements IUserRepo {
  get items(): User[] {
    return this.items;
  }

  public async findUserById(userId: string): Promise<User | null> {
    const match = this.items.find((a) => a.id.toString() === userId);

    if (match) {
      return match;
    }

    return null;
  }

  public async findUserByEmail(targetEmail: string): Promise<User | null> {
    const match = this.items.find(({ email }) => email === targetEmail);

    if (match) {
      return match;
    }

    return null;
  }

  public async exists(targetUser: User): Promise<boolean> {
    const found = this.items.some((user) => this.compareFakeItems(user, targetUser));

    return found;
  }

  public async save(user: User): Promise<void> {
    const exists = await this.exists(user);

    if (!exists) {
      this.items.push(user);
    }
  }

  public compareFakeItems = (user: User, targetUser: User): boolean =>
    user.email === targetUser.email;
}
