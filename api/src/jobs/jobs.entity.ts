import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'numeric', nullable: false })
  salary: number;

  @Column({ length: 100, nullable: false })
  location: string;

  @Column({ length: 100, nullable: false })
  category: string;

  @ManyToOne(() => User)
  employer: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}