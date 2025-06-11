import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IJobService } from './jobs.interface';
import { Job } from './jobs.entity';
import { CreateJobDto, SearchJobDto, UpdateJobDto } from './dtos';
import { User } from '../users/users.entity';

@Injectable()
export class JobsService implements IJobService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
  ) { }

  create(createJobDto: CreateJobDto, employer: User): Promise<Job> {
    const newJob = this.jobRepository.create({ ...createJobDto, employer });
    return this.jobRepository.save(newJob);
  }

  async findAll(query: SearchJobDto): Promise<{ data: Job[]; total: number; page: number; limit: number }> {
    const { title, category, page = 1, limit = 10 } = query;
    const qb = this.jobRepository.createQueryBuilder('job');

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
}
