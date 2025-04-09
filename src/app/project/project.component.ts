import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  projects: any[] = [];
  editingIndex: number | null = null;
  notification: string | null = null;
  notificationType: 'success' | 'error' | null = null;
  searchQuery: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  username: string = '';
  teamOptions: string[] = [
    'Tejas',
    'Ganesh',
    'Kalyan',
    'Om',
    'Rushi',
    'Harshwardhan',
  ];
  selectedTeamMembers: string[] = [];

  project = {
    title: '',
    description: '',
    createdBy: '',
    manager: '',
    startDate: '',
    endDate: '',
    dueDate: '',
    teamMember: -1,
    tasks: [],
  };

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit() {
    const loggedInEmail = localStorage.getItem('email');
    if (loggedInEmail) {
      this.username = this.extractUsername(loggedInEmail);
    }

    this.loadUserProjects();
  }
  private extractUsername(email: string): string {
    const namePart = email.split('@')[0];
    const parts = namePart.split('.');
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }

  createProject() {
    if (
      !this.project.title.trim() ||
      !this.project.description.trim() ||
      !this.project.createdBy.trim() ||
      this.project.teamMember === -1
    ) {
      this.showNotification(
        '⚠️ Please fill in all required fields and select a valid number of team members.',
        'error'
      );
      return;
    }

    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = this.projectService.getProjects();

    if (this.editingIndex !== null) {
      projects[this.editingIndex] = {
        ...this.project,
        teamMember: this.selectedTeamMembers,
      };

      this.showNotification('✅ Project updated successfully!', 'success');
      this.editingIndex = null;
    } else {
      projects.push({
        ...this.project,
        teamMember: this.selectedTeamMembers,
        tasks: [],
      });

      this.showNotification('✅ Project created successfully!', 'success');
    }

    localStorage.setItem(`projects_${loggedInUser}`, JSON.stringify(projects));

    this.loadUserProjects();
    this.resetProjectForm();
    this.selectedTeamMembers = [];
  }

  deleteProject(index: number, event: Event) {
    event.stopPropagation();

    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    const projectTitle = this.projects[index].title;

    if (
      confirm(`Are you sure you want to delete the project "${projectTitle}"?`)
    ) {
      this.projects.splice(index, 1);

      localStorage.setItem(
        `projects_${loggedInUser}`,
        JSON.stringify(this.projects)
      );

      this.showPopupNotification('✅ Project deleted successfully!', 'success');
    }
  }
  selectedProject: any = null;

  viewProject(project: any, event: Event) {
    event.stopPropagation();
    this.selectedProject = project;

    const modal = document.getElementById('viewProjectModal');
    if (modal) {
      (modal as any).style.display = 'block';
      setTimeout(() => modal?.classList.add('show'), 10);
    }
  }
  onCheckboxChange(event: any): void {
    const member = event.target.value;
    if (event.target.checked) {
      this.selectedTeamMembers.push(member);
    } else {
      this.selectedTeamMembers = this.selectedTeamMembers.filter(
        (m) => m !== member
      );
    }
  }

  closeViewModal() {
    const modal = document.getElementById('viewProjectModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => (modal.style.display = 'none'), 200);
    }
  }

  private loadUserProjects() {
    this.projects = this.projectService.getProjects();
    this.projects.forEach((project) => {
      const storedTasks = localStorage.getItem(`tasks_${project.title}`);
      project.taskCount = storedTasks ? JSON.parse(storedTasks).length : 0;
    });
    this.sortProjects();
  }

  private saveProjectsToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  private resetProjectForm() {
    this.project = {
      title: '',
      description: '',
      createdBy: '',
      manager: '',
      startDate: '',
      endDate: '',
      dueDate: '',
      teamMember: -1,
      tasks: [],
    };
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notification = null;
      this.notificationType = null;
    }, 3000);
  }

  showPopupNotification(message: string, type: 'success' | 'error') {
    const popup = document.createElement('div');
    popup.className = `popup-notification ${type}`;
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 3000);
  }

  goToTasks(project: any) {
    this.router.navigate(['/tasks', encodeURIComponent(project.title)]);
  }

  updateProject() {
    if (
      !this.project.title.trim() ||
      !this.project.description.trim() ||
      !this.project.createdBy.trim() ||
      this.project.teamMember === -1
    ) {
      this.showNotification(
        '⚠️ Please fill in all required fields and select a valid number of team members.',
        'error'
      );
      return;
    }

    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = this.projectService.getProjects();

    if (this.editingIndex !== null) {
      projects[this.editingIndex] = {
        ...this.project,
        teamMember: this.selectedTeamMembers,
      };

      this.showNotification('✅ Project updated successfully!', 'success');
      this.editingIndex = null;
    }

    localStorage.setItem(`projects_${loggedInUser}`, JSON.stringify(projects));

    this.loadUserProjects();
    this.resetProjectForm();

    const modalElement = document.getElementById('editProjectModal');
    if (modalElement) {
      (modalElement as any).classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.setAttribute('style', 'display: none;');

      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    }
  }

  filterProjects() {
    const allProjects = this.projectService.getProjects();
    const query = this.searchQuery.toLowerCase();

    this.projects = allProjects.filter((project) => {
      const titleMatch = project.title.toLowerCase().includes(query);
      const descMatch = project.description.toLowerCase().includes(query);

      const storedTasks = localStorage.getItem(`tasks_${project.title}`);
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];

      const taskMatch = tasks.some((task: any) =>
        task.title?.toLowerCase().includes(query)
      );

      return titleMatch || descMatch || taskMatch;
    });
  }

  sortProjects() {
    this.projects.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortProjects();
  }
}
