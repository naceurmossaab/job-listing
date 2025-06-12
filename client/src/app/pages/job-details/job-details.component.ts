import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { Job } from '../../models/job';
import { AuthUser } from '../../models/auth';
import { AuthService } from '../../services/auth.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { SubmissionComponent } from '../../components/submission-form/submission-form.component';
import { SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private submissionService = inject(SubmissionService);
  private modalService = inject(NzModalService);

  job?: Job;
  authUser?: AuthUser;
  hasApplied: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/jobs']);
      return;
    }
    if (!this.authUser) this.authService.authUser$.subscribe(user => this.authUser = user);

    this.jobService.getOne(id).subscribe({
      next: res => (this.job = res),
      error: () => {
        this.router.navigate(['/jobs']);
      }
    });

    this.submissionService.check(id).subscribe({
      next: (response) => this.hasApplied = response.hasApplied,
      error: (err) => { },
    });
  }

  updateJob(id: number): void {
    this.router.navigate(['/jobs/edit', id]);
  }

  applyToJobModal(jobId: number) {
    this.modalService.create({
      nzContent: SubmissionComponent,
      nzData: { user: this.authUser, jobId },
      nzFooter: null,
    });
  }
}
