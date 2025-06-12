import { Component, inject, Input, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SubmissionService } from '../../services/submission.service';
import { AuthUser } from '../../models/auth';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-submission',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './submission-form.component.html',
  styleUrl: './submission-form.component.css',
})
export class SubmissionComponent implements OnInit {
  readonly data: { user: AuthUser, jobId: string } = inject(NZ_MODAL_DATA);
  form: FormGroup;
  cvFile: File | null = null;
  hasApplied: boolean = false;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private submissionService: SubmissionService,
    private messageService: NzMessageService,
  ) {
    this.form = this.fb.group({
      fullName: [this.data.user.login, [Validators.required, Validators.minLength(2)]],
      email: [this.data.user.email, [Validators.required, Validators.email]],
      cv: [null, Validators.required],
      motivationLetter: [''],
    });
  }

  ngOnInit(): void {
    this.submissionService.check(this.data.jobId).subscribe({
      next: (response) => {
        this.hasApplied = response.hasApplied;
        if (this.hasApplied) this.form.disable();
      },
      error: (err) => {
        this.messageService.error('Error: ' + (err.error?.message || 'Unknown error'))
      },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.cvFile = input.files[0];
      this.form.patchValue({ cv: this.cvFile });
    }
  }

  submit() {
    if (this.form.valid && this.cvFile) {
      const formData = new FormData();
      formData.append('fullName', this.form.get('fullName')?.value);
      formData.append('email', this.form.get('email')?.value);
      formData.append('cv', this.cvFile);
      formData.append('motivationLetter', this.form.get('motivationLetter')?.value);
      formData.append('jobId', this.data.jobId.toString());

      this.submissionService.create(formData)
        .subscribe({
          next: () => this.modal.destroy({ success: true }),
          error: (err) => console.error('Submission failed', err),
        });
    }
  }

  cancel() {
    this.modal.destroy();
  }
}