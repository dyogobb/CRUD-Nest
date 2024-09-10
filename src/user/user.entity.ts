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
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  isActive: boolean;
}
