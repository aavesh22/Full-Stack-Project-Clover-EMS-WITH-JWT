import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loginError = '';

    if (this.loginForm.invalid) {
      return;
    }

    console.log('Login payload:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe(
      response => {
        console.log('Login response:', response); 
        // this.showSuccessModal();
        this.router.navigate(['/dashboard']);
      },
      (error: HttpErrorResponse) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          this.loginError = 'Invalid email or password';
        } else {
          this.loginError = `An error occurred (${error.status}). Please try again later.`;
        }
        // Log more details about the error
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
      }
    );
  }

  // showSuccessModal() {
  //   const modalElement = document.getElementById('successModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.show();
  //   } else {
  //     console.error('Success modal element not found');
  //   }
  // }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}