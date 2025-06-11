import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Submission } from '../submissions/submissions.entity';

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

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @Column()
  employerId: number;

  @OneToMany(() => Submission, submission => submission.job)
  submissions: Submission[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}