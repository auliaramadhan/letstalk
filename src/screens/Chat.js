import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  Container,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Thumbnail,
  Text,
} from 'native-base';
import firebaseSDK from '../config/firebaseSDK';
import firebase from 'react-native-firebase';

class Chat extends React.Component {
  state = {
    messages: [],
  };
  render() {
    const data = this.props.navigation.state.params.data;
    return (
      <Container>
        <Header style={{backgroundColor:'#fff', height:64}} >
          <Left>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate('UserDetail', {data})
              }>
              <Thumbnail source={{uri: data.avatar}} style={{padding:16}} />
            </Button>
          </Left>
            <Body>
              <Title style={{color:'#111'}}> {data.name} </Title>
              <Text note> {data.email} </Text>
            </Body>
        </Header>
        <GiftedChat
          onSend={message =>
            firebaseSDK.send(
              message,
              this.props.navigation.state.params.data.token,
            )
          }
          user={{
            name: firebaseSDK.currentUser.displayName,
            avatar: firebaseSDK.currentUser.photoURL,
            _id: firebaseSDK.currentUser.uid,
          }}
          messages={this.state.messages}
        />
      </Container>
    );
  }

  componentDidMount() {
    firebaseSDK.on(this.props.navigation.state.params.data.token, message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })),
    );
  }
  componentWillUnmount() {
    firebaseSDK.off();
  }
}
export default Chat;
