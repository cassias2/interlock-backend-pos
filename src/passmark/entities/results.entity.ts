import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Details } from './details.entity';
import { Reports } from './reports.entity';

@Entity('memtest_results')
export class Results {
  @PrimaryColumn()
  result_id: number;

  @Column()
  session_id: number;

  @Column()
  timestart: string;

  @Column()
  timeupdate: string;

  @Column()
  timestop: string;

  @Column()
  duration: string;

  @Column()
  result: string;

  @OneToMany(() => Details, (details) => details.session_id, { eager: true })
  details: Details[];

  @OneToOne(() => Reports, (reports) => reports.session_id, { eager: true })
  reports: Reports;
}
