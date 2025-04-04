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

  project = {
    title: '',
    description: '',
    createdBy: '',
    manager: '',
    startDate: '',
    endDate: '',
    dueDate: '',
    teamMember: 0,
    tasks: [],
  };

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit() {
    this.loadUserProjects();
  }

  createProject() {
    if (
      !this.project.title.trim() ||
      !this.project.description.trim() ||
      !this.project.createdBy.trim()
    ) {
      this.showNotification('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = this.projectService.getProjects();

    if (this.editingIndex !== null) {
      projects[this.editingIndex] = { ...this.project };
      this.showNotification('✅ Project updated successfully!', 'success');
      this.editingIndex = null;
    } else {
      projects.push({ ...this.project, tasks: [] });
      this.showNotification('✅ Project created successfully!', 'success');
    }

    localStorage.setItem(`projects_${loggedInUser}`, JSON.stringify(projects));

    this.loadUserProjects();
    this.resetProjectForm();
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

      this.showNotification('✅ Project deleted successfully!', 'success');
    }
  }

  private loadUserProjects() {
    this.projects = this.projectService.getProjects();
    this.projects.forEach((project) => {
      const storedTasks = localStorage.getItem(`tasks_${project.title}`);
      project.taskCount = storedTasks ? JSON.parse(storedTasks).length : 0;
    });
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
      teamMember: 0,
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

  goToTasks(project: any) {
    this.router.navigate(['/tasks', encodeURIComponent(project.title)]);
  }

  updateProject() {
    if (
      !this.project.title.trim() ||
      !this.project.description.trim() ||
      !this.project.createdBy.trim()
    ) {
      this.showNotification('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = this.projectService.getProjects();

    if (this.editingIndex !== null) {
      projects[this.editingIndex] = { ...this.project };
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
}
