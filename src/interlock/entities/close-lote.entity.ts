import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('close_lote')
export class LoteClose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  lote: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true, nullable: true })
  admUser: User;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
