import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthService } from "../auth/auth.service";
import { TopicDto } from "./dto/topic.dto";
import { MessagingService } from "./messaging.service";
import { Socket } from "dgram";

@WebSocketGateway(81)
export class MessagingGateway {
  constructor(private authService: AuthService,
              private messagingService: MessagingService) {
  }

  @SubscribeMessage('subscribe')
  async subscribe(@ConnectedSocket() client: Socket, @MessageBody() topic: TopicDto) {
    if(!this.authService.canSubscribe(topic.token, topic.pattern)){
      return {event: "subscribe-fail"};
    }

    // setInterval(() => {
    // }, 2000);

    console.log(client);

    client.send(JSON.stringify({event: "asdas"}));

    return {event: "subscribe-success"};
  }
}
