import { NodeService, SaveBulk } from '@shared/database/services/node.service';
import { Injectable } from '@nestjs/common';
import { FindNodeDto } from '@shared/database/dto/find-node.dto';
import { IP } from '@shared/massa/enums/ip.enum';
import { NodeEntity } from '@shared/database/entity/node.entity';
import { NodeField } from '@shared/database/enum/node-field.enum';

// TODO: refactor type
export type NodeForUpsert = {
  action?: 'insert' | 'updateVersion' | 'lastSeen';
  ip: string;
  nodeId: string;
  id?: number;
  ipVersion?: IP;
  version?: string;
  lastSeen?: Date;
};

@Injectable()
export class NodeComponent {
  constructor(private readonly nodeService: NodeService) {}

  public async findIp(params: FindNodeDto = {}) {
    const dto = await FindNodeDto.from({ ...params, select: [NodeField.Ip] });
    const rows = await this.nodeService.find(dto);
    return rows.map((row) => row.ip);
  }

  public async find(dto: FindNodeDto) {
    return this.nodeService.find(dto);
  }

  /**
   * TODO: refactor
   * основная проблема, которая решена:
   * не выйдем за пределы int в таблице, если бы выполняли 1 запрос вместо 3 - insert into on duplicate key update
   */
  public async saveBulk(results: Map<string, NodeForUpsert>) {
    const insert: SaveBulk[] = [];
    const update: Pick<NodeEntity, 'id' | 'version' | 'lastSeen'>[] = [];
    const lastSeen: number[] = [];

    for (const [, params] of results) {
      const { action, ...node } = params;

      if (action === 'lastSeen') {
        if (node?.id) {
          lastSeen.push(node.id);
          continue;
        }

        insert.push(node);
        continue;
      }

      if (action === 'insert') {
        insert.push(node);
        continue;
      }

      if (action === 'updateVersion') {
        update.push({
          id: node.id,
          version: node.version,
          lastSeen: node.lastSeen,
        });

        continue;
      }
    }

    for (const row of update) {
      await this.nodeService.updateByField('id', row);
    }

    await this.nodeService.insertBulk(insert);

    if (lastSeen.length > 0) {
      await this.nodeService.updateLastSeen(lastSeen);
    }

    return {
      insert: insert.length,
      update: update.length,
      nochanges: lastSeen.length,
    };
  }

  public async updateGeoip(
    rows: Pick<NodeEntity, 'ip' | 'asn' | 'companyId' | 'countryCode'>[],
  ) {
    for (const row of rows) {
      await this.nodeService.updateByField('ip', {
        ip: row.ip,
        asn: row.asn,
        countryCode: row.countryCode,
        companyId: row.companyId,
      });
    }
  }
}
