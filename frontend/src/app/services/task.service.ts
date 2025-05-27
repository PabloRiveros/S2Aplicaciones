import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public tasks: Task[] = [
    {
      id: 1,
      title: 'Tarea ejemplo',
      description: 'Esta es una tarea de ejemplo.',
      status: 'Pendiente',
      priority: 'Alta',
      createdAt: new Date(),
      dueDate: new Date(new Date().getTime() + 86400000) // +1 día
    }
  ];

  getTasks(): Task[] {
    const now = new Date();

  this.tasks = this.tasks.map(task => {
    if (new Date(task.dueDate) < now && task.status !== 'Completada' && task.status !== 'Vencida') {
      return { ...task, status: 'Vencida' };
    }
    return task;
  });

  return this.tasks;
  }

  addTask(task: Task): void {
    task.id = Date.now(); // ID simple
    this.tasks.push(task);
  }

  updateTask(updated: Task): void {
    const index = this.tasks.findIndex(t => t.id === updated.id);
    if (index > -1) this.tasks[index] = updated;
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

}
export { Task };

