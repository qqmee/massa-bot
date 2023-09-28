import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

import { Environment } from '@env';
import { TIMEOUT_MAX, TIMEOUT_PER_RPC } from '../massa.const';
import { UnavailableException } from '../exceptions/unavailable.exception';
import { RejectAfterException, rejectAfter } from '@libs/reject-after';

interface CallOptions {
  rpc?: string;
  method: 'get_status' | 'get_stakers' | 'get_addresses';
  params?: Array<unknown>;
}

@Injectable()
export class RpcService {
  #logger = new Logger(RpcService.name);
  #RPC: string[] = [];

  public constructor(private readonly httpService: HttpService) {
    this.refill();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  private refill(): void {
    this.#RPC = [...Environment.MASSA_RPC];
  }

  /**
   * Trying at least 5 times
   */
  public call<T>({ rpc, ...options }: CallOptions) {
    if (rpc) {
      return this.sendRequest<T>(rpc, options);
    }

    return this.race(TIMEOUT_MAX, async () => {
      for (let i = 1; i < 5; i += 1) {
        try {
          const server = this.getNext();
          const res = await this.sendRequest<T>(server, options);
          return res;
        } catch (error) {
          if (
            error instanceof UnavailableException ||
            error instanceof RejectAfterException
          ) {
            continue;
          }

          throw error;
        }
      }

      throw new UnavailableException();
    });
  }

  /**
   * @throws UnavailableException
   * @throws RejectAfterException
   */
  public async sendRequest<T>(rpc: string, options: CallOptions) {
    if (!rpc) throw new UnavailableException();

    return this.race<T>(TIMEOUT_PER_RPC, async (signal) => {
      try {
        const data = {
          jsonrpc: '2.0',
          id: (Math.random() + 1).toString(36).substring(7),
          ...options,
        };

        this.#logger.debug(`sending '${options.method}' to ${rpc}`);
        const source$ = this.httpService.post(rpc, data, {
          signal,
        });

        const res = await lastValueFrom<AxiosResponse<{ result: T }>>(source$);
        return res.data.result;
      } catch (error) {
        this.remove(rpc);
        throw new UnavailableException(error?.message, { cause: error });
      }
    });
  }

  private async race<T>(
    timeout: number,
    cb: (signal: AbortSignal) => Promise<T>,
  ): Promise<T> {
    const ctrl = new AbortController();

    try {
      const data = await Promise.race([rejectAfter(timeout), cb(ctrl.signal)]);

      return data as T;
    } catch (error) {
      ctrl.abort();
      throw error;
    }
  }

  private remove(rpc: string): void {
    if (!this.#RPC.length) {
      this.refill();
    }

    this.#RPC = this.#RPC.filter((value) => value !== rpc);
  }

  // sequential round robin
  private getNext() {
    const value = this.#RPC.shift();
    this.#RPC.push(value);

    return value;
  }
}
