import { DisplayNodeMode } from '../enum/display-mode.enum';

export interface Session {
  createdAt: Date;
  __language_code?: string;
  displayNodeMode?: DisplayNodeMode;
  notificationsGithub?: boolean;
  notificationsRolls?: boolean;
  isBlocked?: boolean;
}
