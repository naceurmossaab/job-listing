import { Injectable } from '@nestjs/common';
import { IUserService } from './users.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }
}
