import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "dgram";
import { TopicAccessDto } from "../messaging/dto/topic-access.dto";
import { AuthService } from "./auth.service";

@WebSocketGateway(82)
export class AuthGateway {
  private client?: Socket;

  constructor(private authService: AuthService) {
  }

  @SubscribeMessage("access-auth")
  async auth(@ConnectedSocket() client: Socket, @MessageBody() { secret }: AuthAccessDto) {
    if (secret != "secret") {
      return "Error: Not Authorized";
    }

    if (this.client) {
      return "Error: Already Connected";
    }

    this.client = client;

    this.client.on("message", async (msg: string) => {
      let { event, data} = JSON.parse(msg);

      if (event == "revoke-all") {
        this.authService.revokeAll(data);
        this.client.send("ack");
        return
      }

      let topic = data as TopicAccessDto;

      if (event == "grant-publish") {
        this.authService.grantPublish(topic);
        this.client.send("ack");
      }

      if (event == "grant-subscribe") {
        this.authService.grantSubscribe(topic);
        this.client.send("ack");
      }

      if (event == "revoke-publish") {
        this.authService.revokePublish(topic);
        this.client.send("ack");
      }

      if (event == "revoke-subscribe") {
        this.authService.revokeSubscribe(topic);
        this.client.send("ack");
      }

    });

    this.client.on("close", () => {
      this.client = undefined;
    });

    this.client.send("ack")
  }

}
