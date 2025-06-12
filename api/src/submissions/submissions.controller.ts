import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, UseGuards, Req, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, Services } from 'src/utils/constants';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dtos';
import { ISubmissionService } from './submissions.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage, Express } from 'multer';

@ApiTags()
@UseFilters(new HttpExceptionFilter())
@Controller()
export class SubmissionsController {
  constructor(@Inject(Services.SUBMISSIONS) private readonly submissionService: ISubmissionService) { }

  @ApiBearerAuth('token')
  @Roles(Role.JOBSEEKER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'John Doe' },
        email: { type: 'string', format: 'email', example: 'john@example.com' },
        jobId: { type: 'string', example: '1' },
        motivationLetter: { type: 'string', example: 'Optional letter', nullable: true },
        cv: { type: 'string', format: 'binary' },
      },
      required: ['fullName', 'email', 'jobId', 'cv'],
    },
  })
  @UseInterceptors(FileInterceptor('cv', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf)$/))
        return cb(new Error('Only PDF files are allowed!'), false);
      cb(null, true);
    },
  }))
  @Post()
  async create(
    @Req() req,
    @Body() createSubmissionDto: CreateSubmissionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const cvUrl = `/uploads/${file.filename}`;
      return await this.submissionService.create(
        { ...createSubmissionDto, cvUrl },
        req.user,
      );
    } catch (error) {
      throw new HttpException(
        error.detail || error.message,
        error.code ? parseInt(error.code) : 400,
      );
    }
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'jobId', type: Number, required: true, description: 'Job ID to check' })
  @Get('check')
  async checkSubmission(@Query('jobId') jobId: number, @Req() req) {
    const submission = await this.submissionService.check(jobId, req.user.id);
    return { hasApplied: !!submission };
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'jobId', required: false })
  @Get('/job/:jobId')
  findAll(@Req() req, @Param('jobId') jobId?: number) {
    return this.submissionService.findAll(req.user, jobId);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @Get('employer')
  async findByEmployer(@Req() req) {
    return this.submissionService.findByEmployer(req.user.id);
  }

  @ApiBearerAuth('token')
  @Roles()
  @UseGuards(JwtAuthGuard)
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
