import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { User } from "./users.entity";

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User | null>;
  findByLogin(login: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<any>;
  remove(id: number): Promise<any>;
}
