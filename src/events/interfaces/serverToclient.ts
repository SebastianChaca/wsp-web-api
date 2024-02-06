import { FriendApiResponse } from 'src/api/friend/interfaces/friendApiResponse.interface';
import { PopulatedMessage, isTyping } from './message-populated.interface';
import { UserStatus } from './user-status.interface';

export interface ServerToClient {
  'personal-message': (payload: PopulatedMessage) => void;
  'friend-online-status': (payload: UserStatus) => void;
  typing: (payload: isTyping) => void;
  'update-friend-status': (payload: FriendApiResponse) => void;
  'seen-messages': (payload: PopulatedMessage[]) => void;
  'update-message-reaction': (payload: PopulatedMessage) => void;
}
export interface ClientToServer {
  typing: (payload: isTyping) => void;
}
