import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthService } from "../auth/auth.service";
import { TopicAccessDto } from "./dto/topic-access.dto";
import { MessagingService } from "./messaging.service";
import { Socket } from "dgram";

@WebSocketGateway(81)
export class MessagingGateway {
  constructor(private authService: AuthService,
              private messagingService: MessagingService) {
  }

  @SubscribeMessage('subscribe')
  async subscribe(@ConnectedSocket() client: Socket, @MessageBody() topic: TopicAccessDto) {

    if(!this.authService.canSubscribe(topic)){
      client.send(JSON.stringify({
        event: "error",
        data: "Not authorized!"
      }))
      return;
    }

    let messagingService = this.messagingService;
    messagingService.subscribe({
      topicAccess: topic,
      onTopicData(data: any) {
        console.log("Try send!")
        client.send(JSON.stringify({
          event: "data",
          data
        }))
      }
    })

    client.on("close", () => {
      messagingService.unSubscribe(topic)
    })
  }

  @SubscribeMessage('publish')
  async publish(@ConnectedSocket() client: Socket, @MessageBody() patternDataAccess: AccessDto<any>) {
    if(!this.authService.canPublish(patternDataAccess)){
      console.log("Not authorized");
      client.send(JSON.stringify({
        event: "error",
        data: "Not authorized!"
      }))
      return;
    }

    this.messagingService.publish(patternDataAccess)
  }
}
