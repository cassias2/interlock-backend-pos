import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Results } from './results.entity';

@Entity('memtest_reports')
export class Reports {
  @PrimaryColumn()
  result_id: number;

  @OneToOne(() => Results, (results) => results.session_id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'session_id', referencedColumnName: 'session_id' })
  session_id: number;

  @Column({ nullable: true })
  memory_range: string;

  @Column({ nullable: true })
  cpu_selection: string;

  @Column({ nullable: true })
  cpu_temp: string;

  @Column({ nullable: true })
  ram_temp: string;

  @Column()
  tests_passed: string;

  @Column({ nullable: true })
  erroraddr_low: string;

  @Column({ nullable: true })
  erroraddr_high: string;

  @Column({ nullable: true })
  error_bitmask: string;

  @Column({ nullable: true })
  error_numbits: string;

  @Column({ nullable: true })
  errors_maxcont: string;

  @Column({ nullable: true })
  err_cpus: string;
}
