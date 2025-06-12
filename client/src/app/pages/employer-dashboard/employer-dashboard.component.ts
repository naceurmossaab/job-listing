import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../services/submission.service';
import { ISubmission } from '../../models/submission';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzEmptyModule,
    NzSelectModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './employer-dashboard.component.html',
  styleUrl: './employer-dashboard.component.css'
})
export class EmployerDashboardComponent implements OnInit {
  apiUrl = environment.apiUrl.replace('/api/v1/', '/public');
  submissions: ISubmission[] = [];
  sortKey: string = '';
  sortOrder: 'ascend' | 'descend' | null = null;
  statusOptions = ['Pending', 'Reviewed', 'Hired', 'Rejected'];

  constructor(
    private submissionService: SubmissionService,
    private modalService: NzModalService,
    private message: NzMessageService,
  ) { }

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

  viewMotivationLetter(letter?: string) {
    this.modalService.create({
      nzTitle: 'Motivation Letter',
      nzContent: `<div class="p-4">${letter || 'No motivation letter provided'}</div>`,
      nzFooter: [{ label: 'Close', onClick: () => true }],
    });
  }

  updateStatus(applicationId: number, status: string) {
    this.submissionService.updateStatus(applicationId, status).subscribe({
      next: () => {
        this.message.success('Status updated successfully');
        this.loadSubmissions(); // Refresh table
      },
      error: (err) => {
        this.message.error(err.error.message || 'Failed to update status');
      },
    });
  }
}