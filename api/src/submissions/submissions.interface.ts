import { User } from "../users/users.entity";
import { CreateSubmissionDto, UpdateSubmissionDto } from "./dtos";
import { Submission } from "./submissions.entity";

export interface ISubmissionService {
  create(createSubmissionDto: CreateSubmissionDto, employer: User): Promise<Submission>;
  findAll(jobSeeker: User, jobId): Promise<Submission[]>;
  check(jobId: number, jobSeekerId: number): Promise<Submission | null>;
  findOne(id: number): Promise<Submission | null>;
  update(id: number, updateSubmissionDto: UpdateSubmissionDto): Promise<any>;
  remove(id: number): Promise<any>;
}
