import { User } from "../users/users.entity";
import { CreateJobDto, UpdateJobDto, SearchJobDto } from "./dtos";
import { Job } from "./jobs.entity";

export interface IJobService {
  create(createJobDto: CreateJobDto, employer: User): Promise<Job>;
  findAll(query: SearchJobDto): Promise<{ data: Job[]; total: number; page: number; limit: number }>;
  findOne(id: number, query?: any): Promise<Job | null>;
  update(id: number, updateJobDto: UpdateJobDto): Promise<any>;
  remove(id: number): Promise<any>;
  getStats(): Promise<{ totalJobs: number; totalApplications: number }>;
}
