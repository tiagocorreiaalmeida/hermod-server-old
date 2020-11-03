import brypt from 'bcrypt';

import { UseCase } from '../../../../shared/application/useCase';
import { Result } from '../../../../shared/core/Result';
import { User } from '../../domain/User';
import { IUserRepo } from '../../repos/IUserRepo';
import { CreateUserUseCaseDTO } from './CreateUserUseCaseDTO';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { validateUserCreate } from './createUserValidator';

import { EMAIL_EXISTS_ERROR, USERNAME_EXISTS_ERROR } from './createUserErrors';

const HASH_SALT = 10;

export class CreateUserUseCase implements UseCase<CreateUserUseCaseDTO, Result<User>> {
  constructor(private readonly userRepo: IUserRepo) {}

  async execute(dto: CreateUserUseCaseDTO): Promise<Result<User>> {
    const validation = validateUserCreate(dto);

    if (validation.isError) {
      return Result.fail<User>(validation.getError());
    }

    const hashedPassword = brypt.hashSync(dto.password, HASH_SALT);

    const user: User = {
      ...dto,
      id: new UniqueEntityID().toString(),
      password: hashedPassword,
    };

    const userExists = await this.userRepo.findUserByEmailOrUsername(dto.email, dto.username);

    if (userExists) {
      return Result.fail<User>(
        userExists.email === dto.email ? EMAIL_EXISTS_ERROR : USERNAME_EXISTS_ERROR,
      );
    }

    await this.userRepo.save(user);
    return Result.success<User>(user);
  }
}
