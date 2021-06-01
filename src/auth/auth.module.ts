import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGateway } from "./auth.gateway";

@Module({
  controllers: [],
  providers: [AuthService, AuthGateway],
  exports: [AuthService]
})
export class AuthModule {}
