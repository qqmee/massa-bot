import {
  Entity,
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('user_stakers')
@Index('botId_chatId_idx', ['botId', 'chatId'])
export class UserStaker {
  @PrimaryGeneratedColumn({ unsigned: true })
  id?: number;

  @Column({ type: 'bigint' })
  chatId!: number;

  @Column({ type: 'bigint' })
  botId!: number;

  @Column()
  address!: string;

  @Column({ nullable: true })
  tag?: string;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created?: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    precision: null,
    default: null,
    nullable: true,
  })
  deleted?: Date;
}
