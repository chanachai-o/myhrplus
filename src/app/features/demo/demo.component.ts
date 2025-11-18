import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  demoForm: FormGroup;
  selectedCard: 'default' | 'strong' | 'weak' = 'default';
  buttonLoading: boolean = false;
  inputValue: string = '';

  constructor(private fb: FormBuilder) {
    this.demoForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      description: ['']
    });
  }

  ngOnInit(): void {
  }

  onButtonClick(variant: string): void {
    console.log(`${variant} button clicked`);
    if (variant === 'primary') {
      this.buttonLoading = true;
      setTimeout(() => {
        this.buttonLoading = false;
      }, 2000);
    }
  }

  onSubmit(): void {
    if (this.demoForm.valid) {
      console.log('Form submitted:', this.demoForm.value);
      alert('Form submitted successfully!');
    } else {
      console.log('Form is invalid');
    }
  }

  get usernameError(): string {
    const control = this.demoForm.get('username');
    if (control?.hasError('required') && control?.touched) {
      return 'Username is required';
    }
    return '';
  }

  get emailError(): string {
    const control = this.demoForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'Email is required';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Invalid email format';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.demoForm.get('password');
    if (control?.hasError('required') && control?.touched) {
      return 'Password is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}

