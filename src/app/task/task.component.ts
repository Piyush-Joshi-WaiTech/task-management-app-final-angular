import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
declare var bootstrap: any;

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  projectTitle: string = '';
  projectId: string = '';
  tasks: any[] = [];
  sortOption: string = '';
  selectedStatusFilter: string = '';
  assignedToFilter: string = '';

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

  allTasks: any[] = []; // Store unfiltered full task list

  loadTasks() {
    const storedTasks = localStorage.getItem(`tasks_${this.projectTitle}`);
    this.allTasks = storedTasks ? JSON.parse(storedTasks) : [];
    this.tasks = [...this.allTasks]; // Displayed tasks
  }

  createTask() {
    if (!this.task.title.trim() || !this.task.assignedTo.trim()) {
      this.showNotification('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    const newTask = { ...this.task };
    this.tasks.push(newTask);
    this.allTasks.push(newTask); // ✅ Keep allTasks in sync

    localStorage.setItem(
      `tasks_${this.projectTitle}`,
      JSON.stringify(this.tasks)
    );
    // <-- Add this after task creation/deletion

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

    const taskToDelete = this.tasks[index];
    this.tasks.splice(index, 1);

    // ✅ Also remove from allTasks
    const originalIndex = this.allTasks.findIndex(
      (t) =>
        t.title === taskToDelete.title &&
        t.assignedTo === taskToDelete.assignedTo
    );
    if (originalIndex > -1) {
      this.allTasks.splice(originalIndex, 1);
    }

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

  openEditModal(index: number) {
    this.editIndex = index;
    this.editTask = { ...this.tasks[index] };
    this.editMode = true;
  }

  closeEditModal() {
    this.editMode = false;
    this.editTask = {};
    this.editIndex = -1;

    // ✅ Hide Bootstrap modal manually
    const modalElement = document.getElementById('editTaskModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  updateTask() {
    if (this.editIndex > -1) {
      const updatedTask = { ...this.editTask };

      // ✅ Update task in displayed list
      this.tasks[this.editIndex] = updatedTask;

      // ✅ Also update task in allTasks by matching index (fallback to editIndex if no exact match)
      const allIndex = this.allTasks.findIndex(
        (task, i) => i === this.editIndex
      );
      if (allIndex !== -1) {
        this.allTasks[allIndex] = updatedTask;
      }

      // ✅ Save to localStorage
      localStorage.setItem(
        `tasks_${this.projectTitle}`,
        JSON.stringify(this.allTasks)
      );

      this.showNotification('✅ Task updated successfully!', 'success');

      // ✅ Re-apply filters (not filterTasksByStatus to avoid recursion bug)
      this.applyFilters();

      // ✅ Close modal manually
      const modalElement = document.getElementById('editTaskModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      // ✅ Reset modal state
      this.closeEditModal();
    }
  }

  sortTasks() {
    if (this.sortOption === 'priority') {
      const priorityOrder: any = { High: 1, Medium: 2, Low: 3 };
      this.tasks.sort(
        (a, b) => priorityOrder[a.status] - priorityOrder[b.status]
      );
    } else if (this.sortOption === 'dueDate') {
      this.tasks.sort((a, b) => {
        const aDate = new Date(a.dueDate || '2100-01-01').getTime();
        const bDate = new Date(b.dueDate || '2100-01-01').getTime();
        return aDate - bDate;
      });
    }
  }

  filterTasksByStatus() {
    if (this.selectedStatusFilter) {
      this.tasks = this.allTasks.filter(
        (task) => task.status === this.selectedStatusFilter
      );
    } else {
      this.tasks = [...this.allTasks]; // Reset if no filter selected
    }
    this.filterTasksByStatus();
  }
  applyFilters() {
    this.tasks = this.allTasks.filter((task) => {
      const matchesStatus =
        !this.selectedStatusFilter || task.status === this.selectedStatusFilter;

      const matchesAssignedTo =
        !this.assignedToFilter ||
        task.assignedTo
          .toLowerCase()
          .includes(this.assignedToFilter.toLowerCase());

      return matchesStatus && matchesAssignedTo;
    });
  }
}
