import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, UseFilters } from '@nestjs/common';

import { QUEUE_MESSAGES } from '@shared/queue/constants/queue.const';
import { MessengerService } from '@shared/telegram/services/messenger.service';
import { Message } from '../types/message.type';
import { UnableToSendMessageException } from '../exceptions/uname-to-send-message.exception';
import { ExceptionHandler } from '@shared/exception-handler/interfaces/handler.interface';
import { EXCEPTION_HANDLER } from '@shared/exception-handler/constants/exception-handler.const';
import { ExceptionFilter } from '@bot/filters/exception.filter';

@Processor(QUEUE_MESSAGES)
@UseFilters(ExceptionFilter)
export class MessageProcessor {
  public constructor(
    @Inject(EXCEPTION_HANDLER)
    private readonly exceptionHandler: ExceptionHandler,
    private readonly messengerService: MessengerService,
  ) {}

  @OnQueueFailed()
  private handler(job: Job<Message>, error: Error) {
    this.exceptionHandler.handle(error, {
      botId: job.data.botId,
      chatId: job.data.chatId,
    });
  }

  @Process({ concurrency: 2 })
  async message(job: Job<Message>) {
    try {
      await this.messengerService.sendMessage({
        botId: job.data.botId,
        chatId: job.data.chatId,
        text: job.data.text,
      });
    } catch (error) {
      this.handler(
        job,
        new UnableToSendMessageException(job.data.botId, job.data.chatId, {
          cause: error,
        }),
      );
    }
  }
}
