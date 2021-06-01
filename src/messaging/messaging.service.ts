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
    this.subscribers.push(subscriber);
  }

  unSubscribe(topicAccess: TopicAccessDto) {
    this.subscribers = this.subscribers.filter(it =>
      it.topicAccess.token != topicAccess.token && it.topicAccess.pattern != topicAccess.pattern
    );
  }

  publish(patternData: PatternDataDto) {
    if(!patternData.pattern.includes("*")){
      this.topics[patternData.pattern] = true
    }

    let pattern = patternData.pattern.replace("*","")

    for(let topic of Object.keys(this.topics)){
      if(topic.includes(pattern)){
        for (let subscriber of this.subscribers) {
          if (topic.includes(subscriber.topicAccess.pattern.replace("*", ""))) {
            subscriber.onTopicData({ topic, data: patternData.data});
          }
        }
      }
    }

  }
}
