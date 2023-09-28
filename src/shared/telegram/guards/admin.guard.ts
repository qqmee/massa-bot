import { GrammyExecutionContext } from '@grammyjs/nestjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Context } from 'grammy';

import { BotAdmins } from '../types/bot-admins.type';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly ids: BotAdmins) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.ids) return false;

    const executionContent = GrammyExecutionContext.create(context);
    const ctx = executionContent.getContext<Context>();

    return this.ids.includes(ctx.from.id);
  }
}
