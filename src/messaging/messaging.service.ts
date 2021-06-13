import { Injectable } from "@nestjs/common";
import { PatternDataDto } from "./dto/pattern-data.dto";
import { TopicAccessDto } from "./dto/topic-access.dto";
import { TopicDataDto } from "./dto/topic-data.dto";

interface TopicSubscriber {
  topicAccess: TopicAccessDto

  onTopicData(topicData: TopicDataDto)
}

@Injectable()
export class MessagingService {
  private subscribers: Array<TopicSubscriber> = [];
  private topics = {};

  subscribe(subscriber: TopicSubscriber) {
    if (this.subscribers.find(it =>
      it.topicAccess.token == subscriber.topicAccess.token &&
      it.topicAccess.pattern == subscriber.topicAccess.pattern)) {
      return;
    }

    this.subscribers.push(subscriber);
  }

  unSubscribe(topicAccess: TopicAccessDto) {
    this.subscribers = this.subscribers.filter(it =>
      it.topicAccess.token != topicAccess.token && it.topicAccess.pattern != topicAccess.pattern
    );
  }

  publish(patternData: PatternDataDto) {
    if (!patternData.pattern.includes("*")) {
      this.topics[patternData.pattern] = true;
    }

    let pattern = patternData.pattern.replace("*", "");

    console.log(JSON.stringify(patternData));

    for (let topic of Object.keys(this.topics)) {
      if (topic.includes(pattern)) {
        for (let subscriber of this.subscribers) {
          console.log("Match: " + subscriber.topicAccess.token + subscriber.topicAccess.pattern);
          if (topic.includes(subscriber.topicAccess.pattern.replace("*", ""))) {
            console.log("Send: " + subscriber.topicAccess.token);
            subscriber.onTopicData({ topic, data: patternData.data });
          }
        }
      }
    }

  }
}
