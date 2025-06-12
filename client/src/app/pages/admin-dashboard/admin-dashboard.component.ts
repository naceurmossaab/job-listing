import { Component, inject, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { IStats } from '../../models/stats';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NzCardModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})

export class AdminDashboardComponent implements OnInit {
  private jobService = inject(JobService);
  stats: IStats = { totalJobs: 0, totalApplications: 0 };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.jobService.getStats()
      .subscribe({
        next: (data) => (this.stats = data),
        error: (err) => console.error('Failed to load stats', err),
      });
  }
}
