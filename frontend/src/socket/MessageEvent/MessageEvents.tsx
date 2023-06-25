import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  setMessages,
  updateNotifications,
  updateSeenMessages,
  updateFriendsList,
} from '../../redux/chat/chatSlice';
import { useSocketContext } from '../SocketContext/SocketContext';
import { serverMessageResponse, message } from '../../types/message/message';

import {
  sanitizeMessages,
  sanitizeMessage,
} from '../../utils/sanitizeMessages';
import { setIsTyping } from '../../redux/activeChat/activeChatSlice';

interface Props {
  children?: JSX.Element | JSX.Element[];
}
const MessageEvents = ({ children }: Props) => {
  const { socket } = useSocketContext();
  const activeChat = useAppSelector((state) => state.activeChatSlice);

  const dispatch = useAppDispatch();

  // mensaje personal
  useEffect(() => {
    socket?.on('personal-message', (messagePayload: serverMessageResponse) => {
      const sanitMsg = sanitizeMessage(messagePayload);

      dispatch(setMessages(sanitMsg));

      dispatch(updateNotifications(sanitMsg));
    });
  }, [socket, dispatch]);

  // marco si el usuario esta escribiendo un mensaje
  useEffect(() => {
    socket?.on('typing', (messagePayload: message) => {
      dispatch(setIsTyping(messagePayload));
    });
  }, [socket, dispatch, activeChat.uid]);

  // marco como visto el mensaje
  useEffect(() => {
    socket?.on('seen-messages', (messages: serverMessageResponse[]) => {
      const sanitize = sanitizeMessages(messages);
      dispatch(updateSeenMessages(sanitize.reverse()));
    });
  }, [socket, activeChat.uid, dispatch]);

  useEffect(() => {
    socket?.on('update-friend-status', (friend) => {
      dispatch(updateFriendsList(friend));
    });
  }, [socket, dispatch]);
  return <>{children}</>;
};

export default MessageEvents;
