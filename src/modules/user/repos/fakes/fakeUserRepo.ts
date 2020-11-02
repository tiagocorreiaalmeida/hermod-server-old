import { FakeRepo } from '../../../../shared/repo/FakeRepo';
import { User } from '../../domain/User';
import { IUserRepo } from '../IUserRepo';

export class FakeUserRepo extends FakeRepo<User> implements IUserRepo {
  get items(): User[] {
    return this._items;
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

  async findUserByEmailOrUsername(email: string, username: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email || user.username === username);

    return user || null;
  }

  public async exists(userId: string): Promise<boolean> {
    const user = this.items.find((user) => user.id === userId);

    return !!user;
  }

  public async save(user: User): Promise<void> {
    this.items.push(user);
  }

  public compareFakeItems = (user: User, targetUser: User): boolean =>
    user.email === targetUser.email;
}
