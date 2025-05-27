export type TaskStatus = 'Completada' | 'Pendiente' | 'Vencida' | 'En progreso';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Completada' | 'Pendiente' | 'Vencida' |'En progreso';
  priority: 'Alta' | 'Media' | 'Baja';
  createdAt: Date;
  dueDate: Date;
}
