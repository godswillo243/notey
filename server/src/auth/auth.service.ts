import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/models/user.model';
import { Role } from 'src/db/enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already used');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
      password: passwordHash,
      verificationToken,
      verificationTokenExpiresAt,
    });

    void this.emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      message:
        'Registeration successful. Please check your email to verify your account.',
    };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password.');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Invalid email or password.');

    if (!user.isVerified)
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      message: 'Logged in successfully',
      accessToken: tokens.accessToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      return {
        message:
          'If an account exists, a password reset email has been sent. Click the link to reset your password',
      };

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.userService.update(user.id, {
      resetPasswordToken,
      refreshTokenExpiresAt,
    });

    await this.emailService.sendPasswordResetEmail(email, resetPasswordToken);

    return {
      message:
        'If an account exists, a password reset email has been sent. Click the link to reset your password',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByResetPasswordToken(token);
    if (!user)
      throw new BadRequestException(
        'Invalid or expired reset password link. Please request a new one.',
      );
    if (
      user.resetPasswordTokenExpiresAt &&
      user.resetPasswordTokenExpiresAt < new Date()
    )
      throw new BadRequestException(
        'Invalid or expired reset password link. Please request a new one.',
      );
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.userService.update(user.id, {
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    });

    return {
      message: 'Password reset successfully.',
    };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyEmail(token: string, res: Response) {
    const user = await this.userService.findByVerificationToken(token);

    if (!user || !user.verificationToken)
      throw new BadRequestException('Invalid verification token');

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    )
      throw new BadRequestException(
        'Verification token has expired. Please request a new one',
      );

    await this.userService.update(user.id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    });

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      message:
        'Your email has been verified successfully. You are now logged in.',
      accessToken: tokens.accessToken,
      user: this.userService.serialize(user),
    };
  }

  async logout(userId: string, res: Response) {
    console.log(userId);
    const user = await this.userService.update(userId, {
      refreshToken: null,
      refreshTokenExpiresAt: null,
    });
    res.clearCookie('refresh_token');
    if (!user) throw new Error();
    return { message: 'Logged out' };
  }

  async refresh(req: Request, res: Response) {
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies.refresh_token;
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');
    let payload: { sub: string; email: string; role: Role };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired refresh token provided',
      );
    }

    const user = await this.userService.findById(payload.sub);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!tokenMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);

    await this.saveRefreshToken(user.id, tokens.refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
    };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(userId, { refreshToken: refreshTokenHash });
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
