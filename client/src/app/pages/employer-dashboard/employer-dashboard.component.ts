import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../services/submission.service';
import { ISubmission } from '../../models/submission';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { AuthUser } from '../../models/auth';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    NzMessageModule,
    NzInputModule,
    NzEmptyModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './employer-dashboard.component.html',
  styleUrl: './employer-dashboard.component.css'
})
export class EmployerDashboardComponent implements OnInit {
  apiUrl = environment.apiUrl.replace('/api/v1/', '/public');
  authUser?: AuthUser;
  submissions: ISubmission[] = [];
  jobs: Job[] = [];
  selectedJob: any = null;
  sortKey: string = '';
  sortOrder: 'ascend' | 'descend' | null = null;
  statusOptions = ['Pending', 'Reviewed', 'Hired', 'Rejected'];

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private submissionService: SubmissionService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    if (!this.authUser) this.authService.authUser$.subscribe(user => this.authUser = user);
    this.loadSubmissions();
    this.loadJobs();
  }

  loadSubmissions() {
    this.submissionService.getByEmployer().subscribe({
      next: (data) => (this.submissions = data),
      error: (err) => console.error('Failed to load submissions', err),
    });
  }

  loadJobs() {
    this.jobService.getJobs({ employerId: this.authUser?.id }).subscribe({
      next: ({ data }) => (this.jobs = data),
      error: (err) => console.error('Failed to load jobs', err),
    });
  }

  sort(sort: any) {
    this.sortKey = sort.key;
    this.sortOrder = sort.value;
    if (this.sortOrder) {
      this.submissions = [...this.submissions].sort((a, b) => {
        const valueA = this.getNestedValue(a, sort.key);
        const valueB = this.getNestedValue(b, sort.key);
        const order = sort.value === 'ascend' ? 1 : -1;
        return valueA < valueB ? -order : valueA > valueB ? order : 0;
      });
    } else {
      this.loadSubmissions();
    }
  }

  getNestedValue(obj: any, key: string) {
    return key.split('.').reduce((o, k) => (o ? o[k] : ''), obj);
  }

  viewMotivationLetter(letter: string) {
    this.modalService.create({
      nzTitle: 'Motivation Letter',
      nzContent: `<div class="p-4">${letter || 'No motivation letter provided'}</div>`,
      nzFooter: [{ label: 'Close', onClick: () => true }],
    });
  }

  updateStatus(id: number, status: string) {
    this.submissionService.updateStatus(id, status)
      .subscribe({
        next: () => {
          this.message.success('Status updated successfully');
          this.loadSubmissions();
        },
        error: (err) => this.message.error(err.error.message || 'Failed to update status'),
      });
  }

  addJob(): void {
    this.router.navigate(['/jobs/new'], { queryParams: { info: '/employer/dashboard' } });
  }

  updateJob(id: number): void {
    this.router.navigate(['/jobs/edit', id], { queryParams: { info: '/employer/dashboard' } });
  }

  deleteJob(id: number) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this job?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.jobService.delete(id).subscribe({
          next: () => {
            this.message.success('Job deleted successfully');
            this.loadJobs();
          },
          error: (err) => this.message.error(err.error.message || 'Failed to delete job'),
        }),
      nzCancelText: 'No',
    });
  }
}