import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent{
  @Output() edit = new EventEmitter<Task>();
  tasks: Task[] = [];

  filterStatus: string = '';
  filterPriority: string = '';
  searchTerm: string = '';

  constructor(public taskService: TaskService) {}

  onEdit(task: Task) {
    this.edit.emit(task);
  }

  get filteredTasks(): Task[] {
    return this.taskService.getTasks().filter(task =>
    (!this.filterStatus || task.status === this.filterStatus) &&
    (!this.filterPriority || task.priority === this.filterPriority) &&
    (!this.searchTerm ||
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
  );
  }

  onDelete(taskId: number) {
    this.taskService.deleteTask(taskId);
  }

  markAsCompleted(task: Task) {
  const updatedTask = { ...task, status: 'Completada' as 'Completada' | 'Pendiente' | 'Vencida' | 'En progreso' };
  this.taskService.updateTask(updatedTask);
  }

  markAsPending(task: Task) {
  const updatedTask: Task = {
    ...task,
    status: 'Pendiente' as 'Completada' | 'Pendiente' | 'Vencida' | 'En progreso'
  };
  this.taskService.updateTask(updatedTask);
  }
  
  getTimeRemaining(dueDate: Date): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Vencida';
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let result = '';
  if (diffDays > 0) {
    result += `${diffDays}d `;
  }
  if (diffHours > 0) {
    result += `${diffHours}h `;
  }
  result += `${diffMinutes}m`;

  return result;
}

clearFilters() {
    this.filterStatus = '';
    this.filterPriority = '';
  }

}