import { Provider } from '@nestjs/common';

import { LOCKER } from '@cron/constants/cron.const';
import { Locker } from '@libs/locker';

export const LockerProvider: Provider = {
  provide: LOCKER,
  useClass: Locker,
};
