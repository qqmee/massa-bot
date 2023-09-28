import { IP } from '../enums/ip.enum';

export class ConnectedPeer {
  readonly nodeId: string;

  readonly ip: string;

  readonly ipVersion: IP;
}
