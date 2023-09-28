import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IP } from '@shared/massa/enums/ip.enum';

@Entity('nodes')
@Index('ip+nodeId+version_uidx', ['ip', 'nodeId', 'version'], { unique: true })
export class NodeEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({
    length: 52,
    charset: 'latin1',
    collation: 'latin1_general_ci',
  })
  nodeId: string;

  @Column({
    length: 45,
    charset: 'latin1',
    collation: 'latin1_general_ci',
  })
  ip: string;

  @Column({
    type: 'enum',
    enum: IP,
  })
  ipVersion?: IP;

  @Column({
    default: '',
    length: 12,
    charset: 'latin1',
    collation: 'latin1_general_ci',
  })
  version?: string;

  @Column({ nullable: true, unsigned: true })
  companyId?: number;

  @Column({ nullable: true, unsigned: true })
  asn?: number;

  @Column({
    nullable: true,
    type: 'char',
    length: 2,
    charset: 'latin1',
    collation: 'latin1_general_ci',
  })
  countryCode?: string;

  @Column({ type: 'timestamp', precision: null, nullable: true, default: null })
  lastSeen?: Date;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created?: Date;
}
