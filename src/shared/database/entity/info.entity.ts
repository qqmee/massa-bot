import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Info } from '../enum/info.enum';

@Entity({ name: 'info' })
@Index('slug_uidx', ['slug'], { unique: true })
export class InfoEntity<T = unknown> {
  @PrimaryGeneratedColumn({ unsigned: true })
  id?: number;

  @Column({ type: 'enum', enum: Info })
  slug: Info;

  @Column({ type: 'json', nullable: true })
  data?: T;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created?: Date;

  @Column({ type: 'timestamp', precision: 0, nullable: true, default: null })
  updated?: Date;
}
