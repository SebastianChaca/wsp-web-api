import { MessageDocument } from 'src/api/message/entities/message.entity';

export interface PopulatedMessage {
  from: User;
  to: User;
  message: string;
  seen: boolean;
  //TODO cambiar esto
  responseTo: MessageDocument | null;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  iconReactions?: IconReaction[];
}

interface IconReaction {
  user: User;
  icon: string;
  createdAt: Date;
}
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

export interface isTyping {
  to: string;
  from: string;
  messages: string;
}
