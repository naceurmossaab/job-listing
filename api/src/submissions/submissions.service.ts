import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISubmissionService } from './submissions.interface';
import { Submission } from './submissions.entity';
import { User } from '../users/users.entity';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dtos';
import { Role } from '../utils/constants';

@Injectable()
export class SubmissionService implements ISubmissionService {
  constructor(
    @InjectRepository(Submission) private submissionRepository: Repository<Submission>,
  ) { }

  create(createSubmissionDto: CreateSubmissionDto, jobSeeker: User): Promise<Submission> {
    const newJob = this.submissionRepository.create({ ...createSubmissionDto, jobSeeker });
    return this.submissionRepository.save(newJob);
  }

  async findAll(user: User, jobId?: number): Promise<Submission[]> {
    const where: any = {};

    if (user.role === Role.JOBSEEKER) where.jobSeeker = { id: user.id };
    else where.job = { id: jobId };

    return this.submissionRepository.find({
      where,
      relations: ['job', 'jobSeeker'],
      order: { createdAt: 'DESC' },
    });
  }

  check(jobId: number, jobSeekerId: number): Promise<Submission | null> {
    return this.submissionRepository.findOne({ where: { jobId, jobSeekerId } });
  }

  findOne(id: number) {
    return this.submissionRepository.findOne({ where: { id } });
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return this.submissionRepository.update(id, updateSubmissionDto);
  }

  async remove(id: number) {
    return this.submissionRepository.delete(id);
  }
}
