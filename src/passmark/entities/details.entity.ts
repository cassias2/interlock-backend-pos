import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Results } from './results.entity';

@Entity('ram_details')
export class Details {
  @PrimaryColumn()
  name: string;

  @PrimaryColumn()
  serial: string;

  @ManyToOne(() => Results, (results) => results.session_id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'session_id', referencedColumnName: 'session_id' })
  session_id: number;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  manufacturer_specific: string;
}
