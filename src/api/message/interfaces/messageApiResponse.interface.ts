export interface MessageApiResponse {
  from: string;
  to: string;
  message: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}
