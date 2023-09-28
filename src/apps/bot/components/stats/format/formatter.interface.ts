import { Count } from '@shared/database/types/count.type';

export interface StatsFormatterInterface {
  format(data: Count[]): Promise<unknown>;
}
