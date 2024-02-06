import { MessageDocument } from 'src/api/message/entities/message.entity';
import { FriendApiResponse } from './friendApiResponse.interface';
import { Pagination } from 'src/common/interfaces/totalPagination.interface';

export interface GetAllFriends extends Pagination {
  friends: FriendApiResponse[];
  lastMessage?: MessageDocument;
}
