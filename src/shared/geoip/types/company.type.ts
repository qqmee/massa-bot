import { COUNTRIES } from '@bot/constants/countries.const';

export type CompanyPayment =
  | 'mir'
  | 'visa'
  | 'bitcoin'
  | 'qiwi'
  | 'wire'
  | 'ach'
  | 'sepa'
  | 'paypal'
  | 'webmoney'
  | 'yoomoney';

// geoip gateway
export interface Company {
  id: number;
  type: 'hosting' | 'vpn';
  name: string;
  url?: string;
  refUrl?: string;
  payments: Array<CompanyPayment>;
  countries: Array<keyof typeof COUNTRIES>;
  promo?: string;
}
