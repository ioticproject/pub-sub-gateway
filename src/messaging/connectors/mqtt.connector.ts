import { HttpService, Injectable } from "@nestjs/common";
import { MessagingService } from "../messaging.service";
import { Aedes, Server as Broker } from "aedes";
import { createServer, Server } from "net";
import { TopicDataDto } from "../dto/topic-data.dto";
import Dict = NodeJS.Dict;

@Injectable()
export class MqttConnector {
  private broker: Aedes;
  private server: Server;
  private subscriptionTopic: Dict<boolean> = {};

  constructor(private messagingService: MessagingService) {
    this.broker = Broker();

    this.broker.subscribe("#", (packet, cb) => {
      let topic = packet.topic.toString();
      if (!topic.startsWith("$") && !this.subscriptionTopic[topic]) {
        messagingService.publish({
          pattern: topic.replace("/","."),
          data: JSON.parse(packet.payload.toString())
        });
      }

      cb();
    }, () => console.log("Listening to MQTT Broker!"));

    let parent = this;
    this.broker.on("subscribe", (subscriptions => {
      for (let subscription of subscriptions) {
        parent.subscriptionTopic[subscription.topic] = true;
        messagingService.subscribe({
          topicAccess: {
            token: "secret-connector",
            pattern: subscription.topic.replace("/",".")
          },
          onTopicData(topicData: TopicDataDto) {
            parent.broker.publish({
              cmd: "publish",
              qos: 2,
              dup: false,
              topic: topicData.topic.replace(".","/"),
              payload: new Buffer(JSON.stringify(topicData.data)),
              retain: false
            }, error => error && console.log(error));
          }
        });
      }
    }));


    this.server = createServer(this.broker.handle);
    this.server.listen(1337);
    console.log("Server is listening");
  }


}