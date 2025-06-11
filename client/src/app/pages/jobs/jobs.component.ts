import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Job } from '../../models/job';
import { debounceTime, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NzTabsModule,
    NzTableModule,
    NzCardModule,
    NzPaginationModule,
    NzInputModule,
    NzSelectModule,
    NzEmptyModule,
    NzButtonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  total: number = 0;
  page: number = 1;
  limit: number = 10;
  searchQuery: string = '';
  category: string = '';
  searchSubject: Subject<string> = new Subject();
  limits: number[] = [1, 5, 10, 20, 50];
  categories = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'design', label: 'Design' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'others', label: 'Others' },
  ];

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500)).subscribe((query) => {
      this.searchQuery = query;
      this.loadJobs();
    });
    this.loadJobs();
  }

  loadJobs() {
    this.jobService
      .getJobs({ title: this.searchQuery, category: this.category, page: this.page, limit: this.limit })
      .subscribe(({ data, total, limit, page }) => {
        this.jobs = data;
        this.total = total;
        this.limit = limit;
        this.page = page;
      });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  onCategoryChange(category: string) {
    this.category = category;
    this.page = 1;
    this.loadJobs();
  }

  onLimitChange(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.loadJobs();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadJobs();
  }
}
