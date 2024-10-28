import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('interlock')
export class Interlock {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  lote: string;

  @Column({ nullable: true })
  part_number: string;

  @PrimaryColumn()
  sn_he: string;

  @Column({ nullable: true })
  result: string;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @ManyToOne(() => User, (user) => user.id, { eager: true, nullable: true })
  admUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
