import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { JWTAuthGuard } from './common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypegooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    JwtModule.register({ global: true }),
    UsersModule,
    NotesModule,
    AuthModule,
    EmailModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JWTAuthGuard }],
})
export class AppModule {}
