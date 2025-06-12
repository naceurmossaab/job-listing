import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword: Boolean = false;

  private errorMessages: { [key: string]: { [key: string]: string } } = {
    login: { required: 'Login is required.' },
    name: { required: 'Name is required.' },
    email: { required: 'Email is required.', email: 'Invalid email format.' },
    password: { required: 'Password is required.', minlength: 'Password must be at least 8 characters.' },
    role: { required: 'Role is required.' },
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: NzMessageService
  ) {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['jobseeker', Validators.required],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control?.touched || !control?.invalid || !control.errors) return '';

    const errorKey = Object.keys(control.errors)[0];
    return this.errorMessages[controlName]?.[errorKey] || 'Invalid input.';
  }

  selectRole(role: 'jobseeker' | 'employer') {
    this.registerForm.get('role')?.setValue(role);
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.messageService.success('Registration successful! Please log in.');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => this.messageService.error('Registration failed! ' + err.error.message),
      });
    }
  }
}
