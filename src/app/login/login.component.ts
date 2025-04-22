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
  signUpUsername: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Checking, if the user is already logged in (stored in localStorage)
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('loggedIn') === 'true'
    ) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    // Checking that if email or password is empty
    if (this.email.trim() === '' || this.password.trim() === '') {
      this.showError = true;
      return;
    }

    // Retrieving users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const foundUser = storedUsers.find(
      (user: any) =>
        (user.email === this.email || user.username === this.email) &&
        user.password === this.password
    );

    if (foundUser) {
      localStorage.setItem('email', foundUser.email);
      localStorage.setItem('username', foundUser.username);
      localStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/home']);
    } else {
      this.showError = true;
    }
  }

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
    this.showError = false;
  }

  signUp() {
    if (
      this.signUpEmail.trim() === '' ||
      this.signUpPassword.trim() === '' ||
      this.signUpUsername.trim() === '' ||
      !this.isValidEmail(this.signUpEmail)
    ) {
      this.showError = true;
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    const emailExists = storedUsers.some(
      (user: any) => user.email === this.signUpEmail
    );
    const usernameExists = storedUsers.some(
      (user: any) => user.username === this.signUpUsername
    );

    if (emailExists || usernameExists) {
      alert('This email or username is already registered. Please login.');
      this.toggleSignUp();
      return;
    }

    storedUsers.push({
      email: this.signUpEmail,
      password: this.signUpPassword,
      username: this.signUpUsername,
    });

    localStorage.setItem('users', JSON.stringify(storedUsers));

    alert('Sign-up successful! Please log in.');
    this.isSignUp = false;
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.signUpUsername = '';
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validateSignUpInput() {
    this.showError =
      !this.signUpEmail ||
      !this.signUpPassword ||
      !this.signUpUsername ||
      !this.isValidEmail(this.signUpEmail);
  }

  validateInput() {
    this.showError = this.email.trim() === '' || this.password.trim() === '';
  }
}
