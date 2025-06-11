import { User } from "../users/users.entity";
import { SearchJobDto } from "./dtos";
import { CreateJobDto } from "./dtos/create-job.dto";
import { UpdateJobDto } from "./dtos/update-job.dto";
import { Job } from "./jobs.entity";

export interface IJobService {
  create(createJobDto: CreateJobDto, employer: User): Promise<Job>;
  findAll(query: SearchJobDto): Promise<{ data: Job[]; total: number; page: number; limit: number }>;
  findOne(id: number): Promise<Job | null>;
  update(id: number, updateJobDto: UpdateJobDto): Promise<any>;
  remove(id: number): Promise<any>;
}
