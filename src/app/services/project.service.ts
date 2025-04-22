import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor() {}

  getProjects(): any[] {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return []; // If user not logged in, return an empty array

    const userProjects = localStorage.getItem(`projects_${loggedInUser}`); // give project list for that user
    const projects = userProjects ? JSON.parse(userProjects) : [];

    // Dynamically calculate status
    const today = new Date();

    return projects.map((project: any) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      let status = '';
      if (today < start) {
        status = 'Pending';
      } else if (today >= start && today <= end) {
        status = 'In Progress';
      } else {
        status = 'Completed';
      }

      return {
        ...project,
        status,
      };
    });
  }

  // Adds a new project to the user's project list in localStorage
  addProject(project: any) {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = this.getProjects();
    projects.push(project);
    localStorage.setItem(`projects_${loggedInUser}`, JSON.stringify(projects)); // Save back to localStorage
  }

  reloadProjects() {
    return this.getProjects();
  }
}
