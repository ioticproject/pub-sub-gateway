import { Injectable } from '@nestjs/common';
import { Server } from "@nestjs/microservices";
import Dict = NodeJS.Dict;

@Injectable()
export class AuthService {
  private patterns: Dict<Array<string>> = {};

  private match(token, pattern){
    let tokenPatterns = this.patterns[token] || [];
    for(let tokenPattern of tokenPatterns){
      if(pattern.includes(tokenPattern.replace("*",""))){
        return true;
      }
    }
    return false;
  }

  canPublish(token: string, pattern: string): boolean {
    return this.match(token, "sub." + pattern);
  }

  canSubscribe(token: string, pattern: string): boolean {
    return this.match(token, "pub." + pattern);
  }

  grantPublish(token: string, pattern: string){
    this.patterns[token].push("pub." + pattern);
  }

  grantSubscribe(token: string, pattern: string){
    this.patterns[token].push("sub." + pattern);
  }

  revokePublish(token: string, pattern: string) {
    this.patterns[token] = this.patterns[token].filter(it => it !== ("pub." + pattern));
  }

  revokeSubscribe(token: string, pattern: string){
    this.patterns[token] = this.patterns[token].filter(it => it !== ("sub." + pattern));
  }

  revokeAll(token: string) {
    this.patterns[token] = []
  }
}
