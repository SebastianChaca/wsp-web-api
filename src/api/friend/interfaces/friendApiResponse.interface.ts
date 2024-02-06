import { User } from 'src/api/user/interfaces/userApiResponse.interface';

export type FriendApiResponse = {
  user: User;
  notifications: number;
  isRequesting: boolean;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  isPending: boolean;
  isAccepted: boolean;
  isBlocked: boolean;
  id: string;
};
