import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
// Keep your existing imports...
export class TaskComponent implements OnInit {
  projectTitle: string = '';
  projectId: string = '';
  tasks: any[] = [];

  task = {
    title: '',
    assignedTo: '',
    status: '',
    estimate: 0,
    timeSpent: 0,
  };

  showTaskForm: boolean = false;
  notification: string | null = null;
  notificationType: 'success' | 'error' | null = null;

  // Add this to not interfere with Edit modal logic
  editMode: boolean = false;
  editTask: any = {};
  editIndex: number = -1;
  openModal: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.projectTitle = decodeURIComponent(
      this.route.snapshot.paramMap.get('projectTitle') || ''
    );
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    this.loadTasks();
  }

  loadTasks() {
    const storedTasks = localStorage.getItem(`tasks_${this.projectTitle}`);
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
  }

  createTask() {
    if (!this.task.title.trim() || !this.task.assignedTo.trim()) {
      this.showNotification('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    this.tasks.push({ ...this.task });

    localStorage.setItem(
      `tasks_${this.projectTitle}`,
      JSON.stringify(this.tasks)
    );

    this.showNotification('✅ Task created successfully!', 'success');

    // Reset form
    this.task = {
      title: '',
      assignedTo: '',
      status: '',
      estimate: 0,
      timeSpent: 0,
    };
    this.showTaskForm = false;
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notification = null;
      this.notificationType = null;
    }, 3000);
  }

  deleteTask(index: number) {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    this.tasks.splice(index, 1);
    localStorage.setItem(
      `tasks_${this.projectTitle}`,
      JSON.stringify(this.tasks)
    );

    this.showNotification('✅ Task deleted successfully!', 'success');
  }

  getStatusClass(status: string) {
    return {
      'text-danger': status === 'High',
      'text-warning': status === 'Medium',
      'text-primary': status === 'Low',
    };
  }

  // Your existing edit modal logic here (unchanged)
  openEditModal(index: number) {
    this.editIndex = index;
    this.editTask = { ...this.tasks[index] };
    this.editMode = true;
  }

  closeEditModal() {
    this.editMode = false;
    this.editTask = {};
    this.editIndex = -1;
  }

  updateTask() {
    if (this.editIndex > -1) {
      this.tasks[this.editIndex] = { ...this.editTask };
      localStorage.setItem(
        `tasks_${this.projectTitle}`,
        JSON.stringify(this.tasks)
      );
      this.showNotification('✅ Task updated successfully!', 'success');
    }
    this.closeEditModal();
  }
}
