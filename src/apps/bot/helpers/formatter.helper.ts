import { formatter } from '@shared/telegram/util/formatter.util';
import { Company } from '@shared/geoip/types/company.type';

export function tagOrAddress(tag: string, address: string) {
  return tag
    ? tag.replaceAll('_', '\\_').replaceAll('*', '\\*').replaceAll('`', '\\`')
    : address;
}

export function okNokIcon(ok: boolean) {
  return ok ? '✅' : '❗️';
}

export function trimNonASCII(input: string) {
  return input.replace(/[^\x00-\x7F]/g, '');
}

export function getCompanyMD(company: Company) {
  if (!company) return formatter('-');
  if (!company.refUrl) return formatter(company.name);

  return `[${formatter(company.name)}](${formatter(company.refUrl)})`;
}
