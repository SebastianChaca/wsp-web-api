export interface User {
  name: string;
  email: string;
  online: boolean;
  lastActive: string;
  isActive: boolean;
  roles: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  id: string;
}

export interface UserApiResponse {
  user: User;
  token: string;
}
