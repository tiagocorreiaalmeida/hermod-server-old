import { UseCase } from '../../../../shared/application/useCase';
import { Result } from '../../../../shared/core/Result';
import { User } from '../../domain/User';
import { IUserRepo } from '../../repos/IUserRepo';
import { CreateUserUseCaseDTO } from './CreateUserUseCaseDTO';
import { Validator } from '../../../../shared/logic/validators/Validator';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import brypt from 'bcrypt';

export const USER_CREATION_ERROR = 'There was an error when creating the user.';
export const EMAIL_EXISTS_ERROR = 'An User with the given e-mail already exists.';

const HASH_SALT = 10;

export class CreateUserUseCase implements UseCase<CreateUserUseCaseDTO, Result<User>> {
  constructor(
    private readonly validation: Validator<CreateUserUseCaseDTO>,
    private readonly userRepo: IUserRepo,
  ) {}

  async execute(dto: CreateUserUseCaseDTO): Promise<Result<User>> {
    const error = this.validation.validate(dto);

    if (error.isError) {
      return Result.fail<User>(error.getError());
    }

    const hashedPassword = brypt.hashSync(dto.password, HASH_SALT);

    const user: User = {
      ...dto,
      id: new UniqueEntityID().toString(),
      password: hashedPassword,
    };

    const userExists = await this.userRepo.exists(user);

    if (userExists) {
      return Result.fail<User>(EMAIL_EXISTS_ERROR);
    }

    try {
      await this.userRepo.save(user);
    } catch (err) {
      return Result.fail<User>(USER_CREATION_ERROR);
    }

    return Result.success<User>(user);
  }
}
