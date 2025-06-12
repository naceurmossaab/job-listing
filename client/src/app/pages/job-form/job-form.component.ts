import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private messageService = inject(NzMessageService);

  isEdit = false;
  jobId: string | null = null;
  previousRoute: string = '/jobs';

  private errorMessages: { [key: string]: { [key: string]: string } } = {
    title: { required: 'Title is required.' },
    description: { required: 'Description is required.', minlength: 'Description must be at least 10 characters.' },
    salary: { required: 'Salary is required.', pattern: 'Salary must be number.' },
    location: { required: 'Location is required.' },
    category: { required: 'Category is required.' },
  };

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    salary: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    location: ['', Validators.required],
    category: [null, Validators.required]
  });

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control?.touched || !control?.invalid || !control.errors) return '';

    const errorKey = Object.keys(control.errors)[0];
    return this.errorMessages[controlName]?.[errorKey] || 'Invalid input.';
  }

  categories = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'design', label: 'Design' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'others', label: 'Others' },
  ];

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => params['info'] ? this.previousRoute = params['info'] : this.previousRoute = '/jobs');
    this.isEdit = !!this.jobId;

    if (this.isEdit && this.jobId) {
      this.jobService.getOne(this.jobId).subscribe({
        next: (res: any) => {
          this.form.patchValue({
            title: res.title,
            description: res.description,
            salary: res.salary,
            location: res.location,
            category: res.category
          });
        },
        error: () => {
          this.messageService.error('Failed to load job data.');
          this.router.navigate([this.previousRoute]);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const jobData = this.form.value;

    const req = this.isEdit && this.jobId
      ? this.jobService.update(this.jobId, jobData)
      : this.jobService.create(jobData);

    req.subscribe({
      next: () => this.router.navigate([this.previousRoute]),
      error: (err) => this.messageService.error('Error: ' + (err.error?.message || 'Unknown error'))
    });
  }
}
