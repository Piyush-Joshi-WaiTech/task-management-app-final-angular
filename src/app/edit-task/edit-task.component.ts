import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  task: any = {
    title: '',
    assignedTo: '',
    priority: '',
    status: '',
    estimate: '',
    timeSpent: '',
  };
  projectId: number | null = null;
  taskId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.loadTask();
  }

  private loadTask() {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    const projects = JSON.parse(
      localStorage.getItem(`projects_${loggedInUser}`) || '[]'
    );
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.taskId = Number(this.route.snapshot.paramMap.get('taskId'));

    if (this.projectId !== null && this.taskId !== null) {
      const project = projects[this.projectId];
      if (project && project.tasks[this.taskId]) {
        this.task = { ...project.tasks[this.taskId] };
      } else {
        this.router.navigate(['/tasks', this.projectId]); // Redirect if task not found
      }
    }
  }

  updateTask() {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = JSON.parse(
      localStorage.getItem(`projects_${loggedInUser}`) || '[]'
    );

    if (this.projectId !== null && this.taskId !== null) {
      projects[this.projectId].tasks[this.taskId] = { ...this.task };
      localStorage.setItem(
        `projects_${loggedInUser}`,
        JSON.stringify(projects)
      );
    }

    alert('✅ Your task was edited successfully!'); // ✅ Success notification
    this.router.navigate(['/tasks', this.projectId]); // Redirect after update
  }

  cancelEdit() {
    this.router.navigate(['/tasks', this.projectId]); // ✅ Redirect to Task Page
  }
}
