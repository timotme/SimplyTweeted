export enum TweetStatus {
  SCHEDULED = 'scheduled',
  POSTED = 'posted',
  FAILED = 'failed'
}

export interface UserAccount {
  userId: string;
  username: string;
  provider: string;
  providerAccountId: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  scope: string;
  createdAt: Date;
  updatedAt?: Date;
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