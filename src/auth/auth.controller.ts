import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';
import { EnableMfaDto } from './dto/enable-mfa.dto';
import { User } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtGuard)
  @Post('enable-mfa')
  async enableMfa(@User() user) {
    return this.authService.enableMfa(user.id);
  }

  @UseGuards(JwtGuard)
  @Post('verify-mfa')
  async verifyMfa(@User() user, @Body() dto: EnableMfaDto) {
    return this.authService.verifyMfa(user.id, dto.token);
  }
}
