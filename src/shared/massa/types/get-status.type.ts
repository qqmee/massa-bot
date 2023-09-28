import { FixedArray } from './fixed-array.type';

export type MassaGetStatus = {
  node_id: string;
  node_ip: string;
  version: string;
  current_cycle: number;
  connected_nodes: Record<string, FixedArray<[string, boolean]>>;
  next_slot: {
    period: number;
    thread: number;
  };
  consensus_stats: {
    start_timespan: number;
    end_timespan: number;
    final_block_count: number;
    stale_block_count: number;
    clique_count: number;
  };
  execution_stats: {
    final_block_count: number;
    final_executed_operations_count: number;
  };
  config: {
    delta_f0: number;
    periods_per_cycle: number;
    block_reward: number;
  };
};
