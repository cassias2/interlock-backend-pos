import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('eureka')
export class Eureka {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  lote: string;

  @Column()
  sn_he: string;

  @Column({ nullable: true })
  sn_cust: string;

  @Column({ nullable: true })
  sn_rdimm: string;

  @Column({ nullable: true })
  ppid: string;

  @Column({ nullable: true })
  date_spd_write: Date;

  @Column({ nullable: true })
  date_et: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  spd_retest: string;

  @Column({ nullable: true })
  et_retest: string;

  @Column({ nullable: true })
  operator: string;
}
