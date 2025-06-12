import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { IStats } from '../../models/stats';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user';
import { Job } from '../../models/job';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    NzTableModule,
    NzCardModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    NzMessageModule,
    NzInputModule,
    NzEmptyModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})

export class AdminDashboardComponent implements OnInit {
  stats: IStats = { totalJobs: 0, totalApplications: 0 };
  users: IUser[] = [];
  jobs: Job[] = [];
  editUserForm: FormGroup;
  editJobForm: FormGroup;
  isUserModalVisible = false;
  isJobModalVisible = false;
  selectedUser: any = null;
  selectedJob: any = null;
  roles = [
    { value: 'employer', label: 'Employer' },
    { value: 'jobseeker', label: 'JobSeeker' },
  ];
  categories = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'design', label: 'Design' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'others', label: 'Others' },
  ];

  constructor(
    private userService: UserService,
    private jobService: JobService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder,
  ) {
    this.editUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
    this.editJobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      salary: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      location: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadStats();
    this.loadUsers();
    this.loadJobs();
  }

  loadStats() {
    this.jobService.getStats()
      .subscribe({
        next: (data) => (this.stats = data),
        error: (err) => console.error('Failed to load stats', err),
      });
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Failed to load users', err),
    });
  }

  loadJobs() {
    this.jobService.getJobs().subscribe({
      next: (data) => (this.jobs = data.data),
      error: (err) => console.error('Failed to load jobs', err),
    });
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.editUserForm.patchValue(user);
    this.isUserModalVisible = true;
  }

  saveUser() {
    if (this.editUserForm.valid) {
      this.userService.update(this.selectedUser.id, this.editUserForm.value)
        .subscribe({
          next: () => {
            this.message.success('User updated successfully');
            this.loadUsers();
            this.isUserModalVisible = false;
          },
          error: (err) => this.message.error(err.error.message || 'Failed to update user'),
        });
    }
  }

  deleteUser(id: number) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this user?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.userService.delete(id).subscribe({
          next: () => {
            this.message.success('User deleted successfully');
            this.loadUsers();
          },
          error: (err) => this.message.error(err.error.message || 'Failed to delete user'),
        }),
      nzCancelText: 'No',
    });
  }

  editJob(job: any) {
    this.selectedJob = job;
    this.editJobForm.patchValue(job);
    this.isJobModalVisible = true;
  }

  saveJob() {
    if (this.editJobForm.valid) {
      this.jobService.update(this.selectedJob.id, this.editJobForm.value)
        .subscribe({
          next: () => {
            this.message.success('Job updated successfully');
            this.loadJobs();
            this.isJobModalVisible = false;
          },
          error: (err) => this.message.error(err.error.message || 'Failed to update job'),
        });
    }
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

  cancelModal() {
    this.isUserModalVisible = false;
    this.isJobModalVisible = false;
  }
}
