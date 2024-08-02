import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  submitted = false;
  registerError = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.registerError = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe(
      () => {
        this.showSuccessModal();
      },
      (error: {
        error: any; message: string
      }) => {
        this.registerError = 'Registration failed: ' + (error.error?.error || error.message);
        console.error('Registration error: ', error);
      }
    );
  }

  showSuccessModal() {
    const modalElement = document.getElementById('successModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
