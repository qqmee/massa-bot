export type MassaGetAddresses = Array<{
  address: string;
  final_balance: string;
  final_roll_count: number;
  candidate_balance: string;
  candidate_roll_count: number;
  cycle_infos: Array<{
    cycle: number;
    is_final: boolean;
    ok_count: number;
    nok_count: number;
    active_rolls: null | boolean;
  }>;
}>;
