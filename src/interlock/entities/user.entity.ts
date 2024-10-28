import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  matricula: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  role: string;
}
