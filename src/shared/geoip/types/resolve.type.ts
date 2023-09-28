import { Company } from './company.type';

export interface Resolve {
  ip: string;
  isoCode: string;
  country: string;
  company: Company;
  asn: number;
  city: string;
  loc: number[] | null;
}
