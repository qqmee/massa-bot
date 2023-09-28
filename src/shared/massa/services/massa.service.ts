import { Injectable } from '@nestjs/common';

import { RpcService } from './rpc.service';
import { MassaGetStatus } from '../types/get-status.type';
import { MassaGetAddresses } from '../types/get-addresses.type';
import { MassaGetStakers } from '../types/get-stakers.type';
import { AddressDto } from '../dto/address.dto';

@Injectable()
export class MassaService {
  public constructor(private readonly rpcService: RpcService) {}

  public async getAddresses(addresses: string[]) {
    const response = await this.rpcService.call<MassaGetAddresses>({
      method: 'get_addresses',
      params: [[...new Set(addresses)]],
    });

    return this.prepareGetAddresses(addresses, response);
  }

  public async getStakers(): Promise<MassaGetStakers> {
    return this.rpcService.call({ method: 'get_stakers' });
  }

  public async getStatus(rpc?: string): Promise<MassaGetStatus> {
    return this.rpcService.call({ rpc, method: 'get_status' });
  }

  private prepareGetAddresses(
    addresses: string[],
    result: MassaGetAddresses,
  ): Array<AddressDto> {
    if (!result)
      return addresses.map((address) => {
        const dto = new AddressDto();
        dto.address = address;
        return dto;
      });

    return result.map((row) => {
      const dto = new AddressDto();

      dto.address = row.address;

      dto.balance_candidate = row.candidate_balance;
      dto.balance_final = row.final_balance;

      dto.rolls_candidate = row.candidate_roll_count;
      dto.rolls_final = row.final_roll_count;
      dto.cycles = row.cycle_infos
        .map((rowCycle) => ({
          cycle: rowCycle.cycle,
          ok: rowCycle.ok_count,
          nok: rowCycle.nok_count,
          rolls: rowCycle.active_rolls,
          isFinal: rowCycle.is_final,
        }))
        .sort((a, b) => b.cycle - a.cycle);

      const rollsFine = dto.rolls_final > 0 && dto.rolls_candidate > 0;
      const isFine = rollsFine && dto.cycles.every((cycle) => cycle.nok === 0);

      dto.status = isFine ? 'fine' : null;

      return dto;
    });
  }
}
