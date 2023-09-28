import { Module } from '@nestjs/common';

import { IpCommand } from './command/ip.command';
import { LocaleCommand } from './command/locale.command';
import { OnMessage } from './command/_.command';
import { AddCommand } from './command/add.command';
import { DeleteCommand } from './command/delete.command';
import { MyCommand } from './command/my.command';
import { WhoamiCommand } from './command/whoami.command';

import { BotCoreModule } from './bot-core.module';
import { PingController } from './controllers/ping.controller';
@Module({
  imports: [BotCoreModule],
  controllers: [PingController],
  providers: [
    // Commands
    AddCommand,
    DeleteCommand,
    MyCommand,
    LocaleCommand,
    IpCommand,
    WhoamiCommand,
    // Catch all commands/messages
    OnMessage,
  ],
  exports: [],
})
export class BotModule {}
