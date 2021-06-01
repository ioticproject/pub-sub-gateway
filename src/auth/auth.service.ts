import { Injectable } from '@nestjs/common';
import Dict = NodeJS.Dict;
import { TopicAccessDto } from "../messaging/dto/topic-access.dto";

@Injectable()
export class AuthService {
  private patterns: Dict<Array<string>> = {};

  private match(token: string, pattern: string) {
    pattern = pattern.replace("*","");
    let tokenPatterns = this.patterns[token] || [];
    for (let tokenPattern of tokenPatterns) {
      console.log(pattern + " " + tokenPattern);
      if (pattern.includes(tokenPattern.replace("*", ""))) {
        return true;
      }
    }
    return false;
  }

  private checkInit(token) {
    if (!this.patterns[token]){
      this.patterns[token] = []
    }
  }

  canPublish({token, pattern}: TopicAccessDto): boolean {
    return this.match(token, "pub." + pattern);
  }

  canSubscribe({token, pattern}: TopicAccessDto): boolean {
    return this.match(token, "sub." + pattern);
  }

  grantPublish({token, pattern}: TopicAccessDto){
    this.checkInit(token);
    this.revokePublish({token, pattern});
    this.patterns[token].push("pub." + pattern);
  }

  grantSubscribe({token, pattern}: TopicAccessDto){
    this.checkInit(token);
    this.revokeSubscribe({token, pattern});
    this.patterns[token].push("sub." + pattern);
  }

  revokePublish({token, pattern}: TopicAccessDto) {
    this.checkInit(token);
    this.patterns[token] = this.patterns[token].filter(it => it !== ("pub." + pattern));
  }

  revokeSubscribe({token, pattern}: TopicAccessDto){
    this.checkInit(token);
    this.patterns[token] = this.patterns[token].filter(it => it !== ("sub." + pattern));
  }

  revokeAll(token: string) {
    this.patterns[token] = []
  }
}
