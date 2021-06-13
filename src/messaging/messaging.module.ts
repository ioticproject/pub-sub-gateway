import { HttpModule, Module } from "@nestjs/common";
import { MessagingService } from './messaging.service';
import { MessagingGateway } from "./messaging.gateway";
import { AuthModule } from "../auth/auth.module";
import { MqttConnector } from "./connectors/mqtt.connector";

@Module({
  imports: [AuthModule],
  providers: [MessagingService, MessagingGateway, MqttConnector]
})
export class MessagingModule {

}
