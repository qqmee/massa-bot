import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { GithubService } from './services/github.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 10_000, // 10s
      maxRedirects: 0,
    }),
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
