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
  // project structure with default empty values
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
  projectId: number | null = null; //holding the project ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadProject();
  }

  private loadProject() {
    // get logged-in user's email for checking authorization
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    const projects = this.projectService.getProjects();
    this.projectId = Number(this.route.snapshot.paramMap.get('id')); // Get the project ID from route parameters (path variable)

    // If project exists with the given ID, load its details, otherwise navigate to projects page
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

    // Recalculate dueDays before updating
    if (this.project.startDate && this.project.endDate) {
      const start = new Date(this.project.startDate);
      const end = new Date(this.project.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.project.dueDays = daysDiff > 0 ? daysDiff : 0; // checking non negative days
    }

    // Update the project details in the project array and save it to local storage
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
