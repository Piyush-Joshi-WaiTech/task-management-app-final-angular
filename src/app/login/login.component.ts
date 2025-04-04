import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  showError: boolean = false;

  signUpEmail: string = '';
  signUpPassword: string = '';
  isSignUp: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('loggedIn') === 'true'
    ) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (this.email.trim() === '' || this.password.trim() === '') {
      this.showError = true;
      return;
    }

    if (typeof window !== 'undefined') {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

      const foundUser = storedUsers.find(
        (user: any) =>
          user.email === this.email && user.password === this.password
      );

      if (foundUser) {
        localStorage.setItem('email', this.email);

        localStorage.setItem('loggedIn', 'true');
        this.router.navigate(['/home']);
      } else {
        this.showError = true;
      }
    }
  }

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
    this.showError = false;
  }

  signUp() {
    if (this.signUpEmail.trim() === '' || this.signUpPassword.trim() === '') {
      this.showError = true;
      return;
    }

    if (typeof window !== 'undefined') {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

      const emailExists = storedUsers.some(
        (user: any) => user.email === this.signUpEmail
      );

      if (emailExists) {
        alert('This email is already registered. Please login.');
        this.toggleSignUp();
        return;
      }

      storedUsers.push({
        email: this.signUpEmail,
        password: this.signUpPassword,
      });
      localStorage.setItem('users', JSON.stringify(storedUsers));

      alert('Sign-up successful! Please log in.');
      this.isSignUp = false;
      this.signUpEmail = '';
      this.signUpPassword = '';
    }
  }

  validateInput() {
    this.showError = this.email.trim() === '' || this.password.trim() === '';
  }
}
