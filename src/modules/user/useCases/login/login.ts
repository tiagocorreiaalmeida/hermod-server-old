import { UseCase } from '../../../../shared/application/useCase';
import { LoginDTO, LoginDTOResponse } from './loginDTO';
import { Result } from '../../../../shared/core/Result';
import { IUserRepo } from '../../repos/IUserRepo';
import { UserMap } from '../../mappers/userMap';
import { AuthService } from '../../services/auth/authService';
import { PasswordService } from '../../services/password';
import { validateUserLogin } from './loginUserValidator';

import { AUTHENTICATION_FAILED } from './loginErrors';

export class LoginUseCase implements UseCase<LoginDTO, Result<LoginDTOResponse>> {
  constructor(
    private userRepo: IUserRepo,
    private authService: AuthService,
    private passwordService: PasswordService,
  ) {}

  async execute(dto: LoginDTO): Promise<Result<LoginDTOResponse>> {
    const validation = validateUserLogin(dto);

    if (validation.isError) {
      return Result.fail<LoginDTOResponse>(validation.getError());
    }

    const user = await this.userRepo.findUserByEmail(dto.email);
    if (!user) {
      return Result.fail<LoginDTOResponse>(AUTHENTICATION_FAILED);
    }

    const passwordIsValid = this.passwordService.compare(dto.password, user.password);
    if (!passwordIsValid) {
      return Result.fail<LoginDTOResponse>(AUTHENTICATION_FAILED);
    }

    return Result.success<LoginDTOResponse>({
      user: UserMap.toDTO(user),
      accessToken: this.authService.createAccessToken({ userId: user.id }),
      refreshToken: this.authService.createRefreshToken({ userId: user.id }),
    });
  }
}
