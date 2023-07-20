import React from 'react';
import { MenuItem } from '@chakra-ui/react';
import { useAppDispatch } from '../../../../../../../redux/hooks';
import { signOut } from '../../../../../../../redux/session/sessionSlice';
import { resetActiveChatState } from '../../../../../../../redux/activeChat/activeChatSlice';
import { resetChatState } from '../../../../../../../redux/chat/chatSlice';

const Singout = () => {
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(resetActiveChatState());
    dispatch(resetChatState());
  };
  return <MenuItem onClick={handleSignOut}>Singout</MenuItem>;
};

export default Singout;
