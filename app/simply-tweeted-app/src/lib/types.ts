export enum TweetStatus {
  SCHEDULED = 'scheduled',
  POSTED = 'posted',
  FAILED = 'failed'
}

export interface Tweet {
  id?: string;
  userId: string;
  content: string;
  scheduledDate: Date;
  community: string;
  status: TweetStatus;
  createdAt: Date;
  updatedAt?: Date;
} 