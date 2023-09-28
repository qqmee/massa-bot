import { isIPv4 } from 'net';
import { MassaGetStatus } from '../types';
import { IP } from '../enums/ip.enum';
import { ConnectedPeer } from '../types/connected-peer.type';

export function connectedNodes(
  nodes: MassaGetStatus['connected_nodes'],
): ConnectedPeer[] {
  const result = [];

  for (const nodeId in nodes) {
    const [ip] = nodes[nodeId];

    if (/^::ffff:(\d+\.\d+\.\d+\.\d+)$/.test(ip)) {
      result.push({
        nodeId,
        ip: ip.slice(7),
        ipVersion: IP.v4,
      });

      continue;
    }

    const ipVersion = isIPv4(ip) ? IP.v4 : IP.v6;
    result.push({ nodeId, ip, ipVersion });
  }

  return result;
}
