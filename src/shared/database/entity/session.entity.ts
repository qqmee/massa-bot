import { ISession } from '@grammyjs/storage-typeorm';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sessions')
@Index('key_uidx', ['key'], { unique: true })
export class SessionEntity implements ISession {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: string;

  @Column({ charset: 'latin1', collation: 'latin1_general_ci' })
  key: string;

  // good luck with debug unexpected end of JSON input
  // usually it takes < 100b
  @Column({ type: 'varchar', length: 1000 })
  value: string;
}
