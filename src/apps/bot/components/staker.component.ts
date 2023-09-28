import { Injectable } from '@nestjs/common';

import { UserStakerService } from '@shared/database/services/user-staker.service';
import { EntityAlreadyExistsException } from '@shared/database/exceptions/entity-already-exists.exception';
import { MassaService } from '@shared/massa/services/massa.service';
import { FindUserStakerDto } from '@shared/database/dto/find-user-staker.dto';
import { i18n } from '@bot/middleware/i18n.middleware';
import { DeleteUserStakerDto } from '@shared/database/dto/delete-user-staker.dto';
import { AddressDto } from '@shared/massa/dto/address.dto';
import { CreateUserStakerDto } from '@shared/database/dto/create-user-staker.dto';

@Injectable()
export class StakerComponent {
  public constructor(
    private readonly userStakerService: UserStakerService,
    private readonly massaService: MassaService,
  ) {}

  /**
   * if at least 1 address invalid = rpc response throwns exception
   */
  public async infoBatchUnsafe(addresses: string[]) {
    return this.massaService.getAddresses(addresses);
  }

  public async infoBatch(addresses: string[]) {
    return Promise.all(
      addresses.map(async (address) => {
        return this.infoBatchUnsafe([address]);
      }),
    );
  }

  public async info(address: string) {
    const data = await this.infoBatchUnsafe([address]);

    return data?.[0];
  }

  public async create(dto: CreateUserStakerDto) {
    try {
      const entity = await this.userStakerService.create(dto);

      return entity;
    } catch (error) {
      if (error instanceof EntityAlreadyExistsException) {
        return null;
      }

      throw error;
    }
  }

  public async delete(dto: DeleteUserStakerDto) {
    return this.userStakerService.delete(dto);
  }

  public async find(dto: FindUserStakerDto) {
    return this.userStakerService.find(dto);
  }

  public async infoToTextArray(
    locale: string,
    res: AddressDto[],
    tags: Map<string, any> = new Map(),
    onlyBad?: boolean,
  ): Promise<string[]> {
    const info = onlyBad ? res.filter((res) => !res.status) : res;

    return info.map((row) => {
      const address = tags.get(row.address) ?? row.address;

      if (!row.status) {
        return i18n.t(locale, 'address-no-data', { address });
      }

      return i18n.t(locale, 'address-info', {
        ...row,
        address,
        cycles: row.cycles
          .slice(0, 3)
          .map((cycle) => {
            return i18n.t(locale, 'address-info-cycle', cycle);
          })
          .join('\n'),
      });
    });
  }
}
