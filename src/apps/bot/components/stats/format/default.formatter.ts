import { Count } from '@shared/database/types/count.type';
import { StatsFormatterInterface } from './formatter.interface';

export class DefaultFormatter implements StatsFormatterInterface {
  public async format(data: Count[]) {
    return data;
  }
}
