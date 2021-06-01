import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AuthService } from "../auth/auth.service";
import { Socket } from "net";
import { TopicDto } from "./dto/topic.dto";
import { MessagingService } from "./messaging.service";

@WebSocketGateway()
export class MessagingGateway {
  constructor(private authService: AuthService,
              private messagingService: MessagingService) {
  }

  @SubscribeMessage('subscribe')
  subscribe(client: Socket, topic: TopicDto): any {
    if(!this.authService.canSubscribe(topic.token, topic.pattern)){
      return {event: "subscribe-fail"};
    }

    setInterval(() => {
      client.emit("data", "first data!");
    }, 2000);

    return {event: "subscribe-success"};
  }
}
