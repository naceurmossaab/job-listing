import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../utils/constants';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './submissions.entity';
import { SubmissionService } from './submissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  controllers: [SubmissionsController],
  providers: [{ provide: Services.SUBMISSIONS, useClass: SubmissionService }],
  exports: [{ provide: Services.SUBMISSIONS, useClass: SubmissionService }]
})
export class SubmissionsModule { }
