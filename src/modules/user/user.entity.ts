import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 100,
  })
  first_name: string;
  @Column({
    length: 100,
  })
  last_name: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column()
  password: string;
  @Column({ default: false })
  is_logged: boolean;
  @Column({ default: true })
  is_active: boolean;
  @Column({ nullable: true })
  token?: string;
}
