import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  project: any = {
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
  projectId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadProject();
  }

  private loadProject() {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    const projects = this.projectService.getProjects();
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.projectId !== null && projects[this.projectId]) {
      this.project = { ...projects[this.projectId] };
    } else {
      this.router.navigate(['/projects']);
    }
  }

  updateProject() {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = this.projectService.getProjects();

    if (this.projectId !== null) {
      projects[this.projectId] = { ...this.project };
      localStorage.setItem(
        `projects_${loggedInUser}`,
        JSON.stringify(projects)
      );
    }

    alert('✅ Your project was edited successfully!');
    this.router.navigate(['/projects']);
  }
  cancelEdit() {
    this.router.navigate(['/projects']);
  }
}
