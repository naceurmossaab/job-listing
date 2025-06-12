import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './jobs.entity';
import { SubmissionsModule } from '../submissions/submissions.module';

@Module({
  imports: [SubmissionsModule, TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [{ provide: Services.JOBS, useClass: JobsService }],
  exports: [{ provide: Services.JOBS, useClass: JobsService }]
})
export class JobsModule { }
