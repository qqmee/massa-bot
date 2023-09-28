export class AddressDto {
  status: 'fine' | null = null;
  address: string;
  rolls_final: number;
  rolls_candidate: number;
  balance_final: string;
  balance_candidate: string;
  cycles: Array<{
    cycle: number;
    ok: number;
    nok: number;
  }>;
}
