import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  defaultImage: string = '';
  isProfileBoxVisible = false;
  clickedToOpen = false;
  username: string | null = localStorage.getItem('loggedInUser') || 'User';
  email: string | null = localStorage.getItem('email') || 'user@example.com';

  profileImage: string =
    localStorage.getItem('profileImage') ||
    'https://media.istockphoto.com/id/587805156/vector/profile-picture-vector-illustration.jpg?s=612x612&w=0&k=20&c=gkvLDCgsHH-8HeQe7JsjhlOY6vRBJk_sKW9lyaLgmLo=';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProfileFromLocalStorage();
    this.username = localStorage.getItem('username') || 'Guest User';
    this.email = localStorage.getItem('email') || 'guest@example.com';

    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  // Detect clicks outside the profile box to hide it
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

  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  loadProfileFromLocalStorage() {
    const storedImage = localStorage.getItem('profileImage');
    const storedName = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');

    this.profileImage = storedImage ? storedImage : this.defaultImage;
    this.username = storedName || 'User';
    this.email = storedEmail || 'user@example.com';
  }
  saveProfileChanges(): void {
    localStorage.setItem('username', this.username ?? 'Guest User');
    localStorage.setItem('profileImage', this.profileImage);

    this.username = localStorage.getItem('username') || 'Guest User';
    this.profileImage =
      localStorage.getItem('profileImage') ||
      'https://media.istockphoto.com/id/587805156/vector/profile-picture-vector-illustration.jpg?s=612x612&w=0&k=20&c=gkvLDCgsHH-8HeQe7JsjhlOY6vRBJk_sKW9lyaLgmLo=';

    // Automatically close modal
    const modalEl = document.getElementById('profileSettingsModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }

    // Message: Shows a simple alert
    alert('Profile updated successfully!');
  }
}
