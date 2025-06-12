import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../services/submission.service';
import { ISubmission } from '../../models/submission';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzEmptyModule
  ],
  templateUrl: './employer-dashboard.component.html',
  styleUrl: './employer-dashboard.component.css'
})
export class EmployerDashboardComponent implements OnInit {
  apiUrl = environment.apiUrl.replace('/api/v1/', '/public');
  submissions: ISubmission[] = [];
  sortKey: string = '';
  sortOrder: 'ascend' | 'descend' | null = null;

  constructor(private submissionService: SubmissionService) { }

  ngOnInit() {
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.submissionService.getByEmployer()
      .subscribe({
        next: (data) => (this.submissions = data),
        error: (err) => console.error('Failed to load submissions', err),
      });
  }

  sort(sort: any) {
    this.sortKey = sort.key;
    this.sortOrder = sort.value;
    if (this.sortOrder) {
      this.submissions = [...this.submissions].sort((a, b) => {
        const valueA = (a as any)[sort.key];
        const valueB = (b as any)[sort.key];
        const order = sort.value === 'ascend' ? 1 : -1;
        return valueA < valueB ? -order : valueA > valueB ? order : 0;
      });
    } else {
      this.loadSubmissions(); // Reset to original order
    }
  }
}