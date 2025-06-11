import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, UseGuards, Req } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, Services } from 'src/utils/constants';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dtos';
import { ISubmissionService } from './submissions.interface';

@ApiTags()
@UseFilters(new HttpExceptionFilter())
@Controller()
export class SubmissionsController {
  constructor(@Inject(Services.SUBMISSIONS) private readonly submissionService: ISubmissionService) { }

  @ApiBearerAuth('token')
  @Roles(Role.EMPLOYER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Req() req, @Body() createSubmissionDto: CreateSubmissionDto) {
    try {
      return await this.submissionService.create(createSubmissionDto, req.user);
    }
    catch (error) {
      throw new HttpException(error.detail || error.message, error.code ? parseInt(error.code) : 400);
    }
  }

  @ApiBearerAuth('token')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/job/:jobId')
  findAll(@Req() req, @Param('jobId') jobId?: number) {
    if (jobId && req.user.role === Role.JOBSEEKER)
      throw new HttpException('Job seekers cannot view submissions for jobs', HttpStatus.FORBIDDEN);
    return this.submissionService.findAll(req.user, jobId);
  }

  @ApiBearerAuth('token')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const submission = await this.submissionService.findOne(id);
    if (!submission) throw new HttpException(`no submission with id: ${id}`, HttpStatus.BAD_REQUEST);
    return submission;
  }

  @ApiBearerAuth('token')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateSubmissionDto: UpdateSubmissionDto) {
    const submission = await this.submissionService.findOne(id);
    if (!submission) throw new HttpException(`no submission with id: ${id}`, HttpStatus.NOT_FOUND);

    return this.submissionService.update(id, updateSubmissionDto);
  }

  @ApiBearerAuth('token')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.submissionService.remove(id);
    if (result.affected === 0) throw new HttpException(`no submission with id: ${id}`, HttpStatus.NOT_FOUND);
  }
}
