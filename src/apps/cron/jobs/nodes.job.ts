import { Injectable, Logger } from '@nestjs/common';
import { defer, from, lastValueFrom } from 'rxjs';

import { AbstractJob } from './abstract.job';
import { FindNodeDto } from '@shared/database/dto/find-node.dto';
import { NodeField } from '@shared/database/enum/node-field.enum';
import { InfoService } from '@shared/database/services/info.service';
import { concurrent } from '@cron/util/concurrent.util';
import { MassaService } from '@shared/massa/services/massa.service';
import { RPC_PORT } from '@shared/massa/massa.const';
import { IP } from '@shared/massa/enums/ip.enum';
import { connectedNodes } from '@shared/massa/util/connected-nodes.util';
import { NodeComponent, NodeForUpsert } from '@bot/components/node.component';
import { chunk } from '@bot/helpers/chunk.helper';

@Injectable()
export class NodesJob extends AbstractJob {
  logger = new Logger(NodesJob.name);

  timeout = 60_000 * 15; // 15 minutes

  /**
   * parallel RPC requests
   */
  concurrency = 10;

  public constructor(
    private readonly nodeComponent: NodeComponent,
    private readonly infoService: InfoService,
    private readonly massaService: MassaService,
  ) {
    super();
  }

  public async doWork() {
    // const { version } = await this.infoService.getCurrentRelease();

    const dto = await FindNodeDto.from({
      select: [NodeField.Id, NodeField.Ip, NodeField.NodeId, NodeField.Version],
      ipVersion: IP.v4,
      version: 'DEVN.24.1',
    });

    const rows = await this.nodeComponent.find(dto);

    const results = new Map<string, NodeForUpsert>();
    const stack: NodeForUpsert[][] = [...chunk(rows, this.concurrency)];

    while (stack.length > 0) {
      const nodes = stack.pop();

      // wait until 10 requests finished
      await this.poll(nodes, async (node) => {
        if (node.ipVersion && node.ipVersion !== IP.v4) {
          return;
        }

        const key = `${node.ip}_${node.nodeId}`;
        if (results.has(key)) {
          // console.log(`node ${node.ip} already exists`);
          return;
        }

        const info = await this.getNodeInfo(node.ip);

        // TODO: refactor
        if (!info) {
          if (node?.id) {
            results.set(key, { ...node, action: 'lastSeen' });
          } else {
            results.set(key, { ...node, action: 'insert' });
          }

          return;
        }

        // TODO: refactor
        if (node?.id) {
          if (node?.version === info.version) {
            // row exists but no changes
            results.set(key, { ...node, action: 'lastSeen' });
          } else {
            // row exists, version changed
            results.set(key, {
              ...node,
              version: info.version,
              lastSeen: new Date(),
              action: 'updateVersion',
            });
          }
        } else {
          // row not exists
          results.set(key, {
            ...node,
            version: info.version,
            lastSeen: new Date(),
            action: 'insert',
          });
        }

        const tmp = info.peers.map((peer) => ({
          ip: peer.ip,
          nodeId: peer.nodeId,
          ipVersion: peer.ipVersion,
          lastSeen: new Date(),
        }));

        stack.push(...chunk(tmp, this.concurrency));
      });
    }

    const stats = await this.nodeComponent.saveBulk(results);
    this.logger.log(
      `Nodes insert=${stats.insert} update=${stats.update} nochanges=${stats.nochanges}`,
    );
  }

  private async getNodeInfo(ip: string) {
    const rpc = `http://${ip}:${RPC_PORT}`;

    try {
      const result = await this.massaService.getStatus(rpc);
      const peers = connectedNodes(result.connected_nodes);

      return {
        version: result.version,
        peers,
      };
    } catch (error) {
      return null;
    }
  }

  private async poll<I, O>(
    arr: I[],
    callback: (item: I, arr: I[]) => Promise<O>,
  ): Promise<O[]> {
    const observables = arr.map((row, index, array) =>
      defer(() => from(callback(row, array))),
    );
    const source$ = concurrent<O>(observables, this.concurrency);
    const data = await lastValueFrom<O[]>(source$);
    return data;
  }
}
