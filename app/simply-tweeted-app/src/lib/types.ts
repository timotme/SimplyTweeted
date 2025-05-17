export interface Tweet {
  id?: string;
  userId: string;
  content: string;
  scheduledDate: Date;
  community: string;
  status: 'scheduled' | 'posted' | 'failed';
  createdAt: Date;
  updatedAt?: Date;
} 