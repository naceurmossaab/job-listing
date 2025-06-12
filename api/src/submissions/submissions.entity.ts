import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { SubmissionStatus } from '../utils/constants';
import { User } from '../users/users.entity';
import { Job } from '../jobs/jobs.entity';

@Entity()
@Unique(['jobSeekerId', 'jobId'])
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  motivationLetter?: string;

  @Column()
  cvUrl: string;

  @ManyToOne(() => User, user => user.submissions)
  @JoinColumn({ name: 'jobSeekerId' })
  jobSeeker: User;

  @Column()
  jobSeekerId: number;

  @ManyToOne(() => Job, job => job.submissions)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  jobId: number;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}
