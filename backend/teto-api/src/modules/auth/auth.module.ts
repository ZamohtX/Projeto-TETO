import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersController } from '../users/users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    UsersModule, // Precisamos buscar o usurario no banco para validar a senha
    PassportModule,
    JwtModule.register({
      global: true, // Deixa o JWT disponivel no projeto todo sem precisar importar de novo
      secret: 'SEGREDO_SUPER_SECRETO_DO_TETO_APP', // TODO: Mover para .env
      signOptions: {expiresIn: '7d'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule{}
