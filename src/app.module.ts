import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [AuthModule, MessagingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
