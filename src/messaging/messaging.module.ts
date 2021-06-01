import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from "./messaging.gateway";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [MessagingService, MessagingGateway]
})
export class MessagingModule {}
