import React from 'react';
import {View, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Container} from 'native-base';

const Chat = () => {
  return (
    <Container>
      <GiftedChat />
    </Container>
  );
};

export default Chat;
