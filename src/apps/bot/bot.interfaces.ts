import { Context, SessionFlavor } from 'grammy';
import type { I18nFlavor } from '@grammyjs/i18n';
import type { ParseModeFlavor } from '@grammyjs/parse-mode';

import { RefsComponent } from './components/refs.component';
import { GithubComponent } from './components/github.component';
import { StatsComponent } from './components/stats/stats.component';
import { Session } from '@shared/database/types/session.type';

interface ExtraComponents {
  refsComponent: RefsComponent;
  githubComponent: GithubComponent;
  statsComponent: StatsComponent;
}

export type BotContext = I18nFlavor &
  ParseModeFlavor<Context> &
  SessionFlavor<Session> &
  ExtraComponents;
