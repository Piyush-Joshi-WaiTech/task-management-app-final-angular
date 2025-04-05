// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProjectService {
//   private storageKey = 'projects'; // Key for localStorage

//   private projects: any[] = [];

//   constructor() {
//     this.loadProjects();
//   }

//   // ✅ Load projects from localStorage
//   private loadProjects() {
//     if (typeof localStorage !== 'undefined') {
//       const storedProjects = localStorage.getItem(this.storageKey);
//       this.projects = storedProjects ? JSON.parse(storedProjects) : [];
//     }
//   }

//   // ✅ Get all projects
//   getProjects(): any[] {
//     return this.projects;
//   }

//   // ✅ Add project and save to localStorage
//   addProject(project: any) {
//     this.projects.push(project);
//     if (typeof localStorage !== 'undefined') {
//       localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
//     }
//   }

//   // ✅ Refresh projects from localStorage (for Project Page)
//   reloadProjects() {
//     this.loadProjects();
//   }
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor() {}

  getProjects(): any[] {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return [];

    const userProjects = localStorage.getItem(`projects_${loggedInUser}`);
    const projects = userProjects ? JSON.parse(userProjects) : [];

    // ✅ Dynamically calculate status
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

  addProject(project: any) {
    const loggedInUser = localStorage.getItem('email');
    if (!loggedInUser) return;

    let projects = this.getProjects();
    projects.push(project);
    localStorage.setItem(`projects_${loggedInUser}`, JSON.stringify(projects));
  }

  reloadProjects() {
    return this.getProjects();
  }
}
