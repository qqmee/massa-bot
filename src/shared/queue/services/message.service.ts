import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { QUEUE_MESSAGES } from '../constants/queue.const';
import { Message } from '../types/message.type';

@Injectable()
export class MessageService {
  public constructor(
    @InjectQueue(QUEUE_MESSAGES) private readonly messagesQueue: Queue,
  ) {}

  public addBulk(data: Message[]) {
    if (!data.length) return;

    const bulk = data.map((data) => ({ data }));
    return this.messagesQueue.addBulk(bulk);
  }

  public add(data: Message) {
    if (!data) return;

    return this.messagesQueue.add(data);
  }
}
