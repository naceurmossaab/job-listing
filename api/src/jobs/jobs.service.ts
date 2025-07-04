import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IJobService } from './jobs.interface';
import { Job } from './jobs.entity';
import { CreateJobDto, SearchJobDto, UpdateJobDto } from './dtos';
import { User } from '../users/users.entity';
import { Services } from '../utils/constants';
import { ISubmissionService } from '../submissions/submissions.interface';

@Injectable()
export class JobsService implements IJobService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @Inject(Services.SUBMISSIONS) private readonly submissionService: ISubmissionService
  ) { }

  create(createJobDto: CreateJobDto, employer: User): Promise<Job> {
    const newJob = this.jobRepository.create({ ...createJobDto, employer });
    return this.jobRepository.save(newJob);
  }

  async findAll(query: SearchJobDto): Promise<{ data: Job[]; total: number; page: number; limit: number }> {
    const { employerId, title, category, page = 1, limit = 10 } = query;
    const qb = this.jobRepository.createQueryBuilder('job');
    if (employerId) {
      const [data, total] = await qb
        .andWhere('job.employerId = :employerId', { employerId })
        .orderBy('job.createdAt', 'DESC')
        .getManyAndCount();
      return { data, total, page: 0, limit: 0 }
    }

    if (title) qb.andWhere('job.title ILIKE :title', { title: `%${title}%` });
    if (category) qb.andWhere('job.category = :category', { category });

    const [data, total] = await qb
      .orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  findOne(id: number) {
    return this.jobRepository.findOne({ where: { id } });
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return this.jobRepository.update(id, updateJobDto);
  }

  async remove(id: number) {
    return this.jobRepository.delete(id);
  }

  async getStats(): Promise<{ totalJobs: number; totalApplications: number }> {
    const totalJobs = await this.jobRepository.count();
    const totalApplications = await this.submissionService.count();
    return { totalJobs, totalApplications };
  }
}
