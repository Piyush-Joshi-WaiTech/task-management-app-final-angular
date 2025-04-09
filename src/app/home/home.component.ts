import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class HomeComponent {
  username: string | null = '';
  isDarkMode = false;

  notification: string | null = null;
  project = {
    title: '',
    description: '',
    createdBy: '',
    manager: '',
    startDate: '',
    endDate: '',
    teamMember: 0,
    dueDays: 0,
    teamMembersArray: [] as string[], // 👈 new field
  };

  tasks: any[] = [];
  task = {
    title: '',
    assignedTo: '',
    status: '',
    estimatedTime: '',
  };

  isTaskCreationVisible: boolean = false;
  showError: boolean = false;
  showTaskError: boolean = false;
  isTeamDropdownOpen = false; // Toggle for dropdown

  constructor(private router: Router, private projectService: ProjectService) {
    if (typeof localStorage !== 'undefined') {
      this.username = localStorage.getItem('email');
    }
    if (this.username) {
      this.project.createdBy = this.username;
    }

    if (
      !localStorage.getItem('loggedIn') ||
      localStorage.getItem('loggedIn') !== 'true'
    ) {
      this.router.navigate(['/login']);
    }

    if (localStorage.getItem('darkMode') === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark-mode');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }

  createProject() {
    this.validateProjectForm();
    if (this.showError) {
      return;
    }

    const start = new Date(this.project.startDate);
    const end = new Date(this.project.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.project.dueDays = daysDiff > 0 ? daysDiff : 0;

    this.projectService.addProject({ ...this.project, tasks: [] });

    console.log('Project Created:', this.project);

    this.notification = '✅ Project created successfully!';

    this.project = {
      title: '',
      description: '',
      createdBy: this.username || '',
      manager: '',
      startDate: '',
      endDate: '',
      teamMember: 0,
      dueDays: 0,
      teamMembersArray: [],
    };

    this.showError = false;

    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  validateProjectForm() {
    this.showError =
      !this.project.title ||
      !this.project.description ||
      !this.project.createdBy ||
      !this.project.manager ||
      !this.project.startDate ||
      !this.project.endDate ||
      this.project.teamMember <= 0;
  }

  toggleTaskCreation() {
    this.isTaskCreationVisible = !this.isTaskCreationVisible;
  }
  availableTeamMembers = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank'];

  onTeamMemberChange(name: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.project.teamMembersArray.push(name);
    } else {
      const index = this.project.teamMembersArray.indexOf(name);
      if (index !== -1) this.project.teamMembersArray.splice(index, 1);
    }

    this.project.teamMember = this.project.teamMembersArray.length;
  }

  createTask() {
    this.validateTaskForm();

    if (this.showTaskError) {
      return;
    }

    this.tasks.push({ ...this.task });
    console.log('Task Created:', this.task);
    alert('Task Created Successfully!');

    // Reset form
    this.task = { title: '', assignedTo: '', status: '', estimatedTime: '' };
    this.showTaskError = false;
  }

  validateTaskForm() {
    this.showTaskError = true;

    if (
      this.task.title &&
      this.task.assignedTo &&
      this.task.status &&
      this.task.estimatedTime
    ) {
      this.showTaskError = false;
    }
  }

  editTask(task: any) {
    console.log('Edit task:', task);
  }

  deleteTask(task: any) {
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
