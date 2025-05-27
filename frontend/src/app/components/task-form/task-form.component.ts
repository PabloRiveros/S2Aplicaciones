import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  template: `
  <app-task-form
    [taskToEdit]="selectedTask"
    (formSubmit)="onFormSubmit()"
  ></app-task-form>
  <app-task-list
    (edit)="onEditTask($event)"
  ></app-task-list>
`,

})
export class TaskFormComponent implements OnChanges{
  @Input() taskToEdit: Task | null = null;
  @Output() formSubmit = new EventEmitter<Task>();

  task: Partial<Task> = {
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    dueDate: new Date()
  };

  editMode = false;
  editingTaskId: number | null = null;

  constructor(public taskService: TaskService) {}

  ngOnChanges() {
    if (this.taskToEdit) {
      this.editTask(this.taskToEdit);
    }
  }

  editTask(task: Task) {
    this.task = { ...task };
    this.editMode = true;
    this.editingTaskId = task.id;
  }

  get isEditing(): boolean{
    return this.editMode && this.editingTaskId !== null;
  }

  onSubmit() {
    if (this.editMode && this.editingTaskId !== null) {
      const updatedTask: Task = {
        ...(this.task as Task),
        id: this.editingTaskId,
        dueDate: new Date(this.task.dueDate!),
        createdAt: this.task.createdAt || new Date(),
        status: this.task.status as 'Completada' | 'Pendiente' | 'Vencida' | 'En progreso',
        priority: this.task.priority as 'Alta' | 'Media' | 'Baja'
      };
      this.taskService.updateTask(updatedTask);
    } else {
      const newTask: Task = {
        ...(this.task as Task),
        id: Date.now(),
        createdAt: new Date(),
        dueDate: new Date(this.task.dueDate!),
        status: this.task.status as 'Completada' | 'Pendiente' | 'Vencida' | 'En progreso',
        priority: this.task.priority as 'Alta' | 'Media' | 'Baja'        
      };
      this.taskService.addTask(newTask);
    }

    this.task = {
      title: '',
      description: '',
      status: 'Pendiente',
      priority: 'Media',
      dueDate: new Date()
    };
    this.editMode = false;
    this.editingTaskId = null;

    this.formSubmit.emit();
  }
}
