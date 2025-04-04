import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isProfileBoxVisible = false;
  clickedToOpen = false;
  username: string | null = localStorage.getItem('loggedInUser') || 'User';
  email: string | null = localStorage.getItem('email') || 'user@example.com';

  constructor(private router: Router) {}

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: any) {
    const target = event.target;
    const insideUserBox = target.closest('.user-box-container');
    if (!insideUserBox) {
      this.clickedToOpen = false;
      this.isProfileBoxVisible = false;
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  showProfileBox() {
    this.isProfileBoxVisible = true;
  }

  hideProfileBox() {
    this.isProfileBoxVisible = false;
  }

  toggleProfileBox() {
    this.clickedToOpen = !this.clickedToOpen;
    this.isProfileBoxVisible = this.clickedToOpen;
  }

  onHoverEnter() {
    this.showProfileBox();
  }

  onHoverLeave() {
    if (!this.clickedToOpen) {
      this.hideProfileBox();
    }
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
