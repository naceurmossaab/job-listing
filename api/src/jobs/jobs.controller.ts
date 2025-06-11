import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, Query, UseGuards, Req } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, Services } from 'src/utils/constants';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { IJobService } from './jobs.interface';
import { CreateJobDto, UpdateJobDto } from './dtos';

@ApiTags()
@UseFilters(new HttpExceptionFilter())
@Controller()
export class JobsController {
  constructor(@Inject(Services.JOBS) private readonly jobService: IJobService) { }

  @ApiBearerAuth('token')
  @Roles(Role.EMPLOYER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Req() req, @Body() createJobDto: CreateJobDto) {
    try {
      return await this.jobService.create(createJobDto, req.user);
    }
    catch (error) {
      throw new HttpException(error.detail || error.message, error.code ? parseInt(error.code) : 400);
    }
  }

  @Get()
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit per page' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Search by job name' })
  findAll(@Query() query: any) {
    return this.jobService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const job = await this.jobService.findOne(id);
    if (!job) throw new HttpException(`no job with id: ${id}`, HttpStatus.BAD_REQUEST);
    return job;
  }

  @ApiBearerAuth('token')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    const job = await this.jobService.findOne(id);
    if (!job) throw new HttpException(`no job with id: ${id}`, HttpStatus.NOT_FOUND);

    return this.jobService.update(id, updateJobDto);
  }

  @ApiBearerAuth('token')
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.jobService.remove(id);
    if (result.affected === 0) throw new HttpException(`no job with id: ${id}`, HttpStatus.NOT_FOUND);
  }
}
