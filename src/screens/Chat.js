import React, {useEffect, useState} from 'react';
import {View, Clipboard, Alert} from 'react-native';
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
        <Header style={{height: 64}}>
          <Left>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate('UserDetail', {data})
              }>
              {data.avatar ? (
                <Thumbnail source={{uri: data.avatar}} style={{padding: 16}} />
              ) : (
                <Icon name="user" type="FontAwesome5" style={{padding: 16}} />
              )}
            </Button>
          </Left>
          <Body>
            <Title> {data.name} </Title>
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
          onLongPress={this.onLongPress.bind(this)}
          messages={this.state.messages}
        />
      </Container>
    );
  }

  onLongPress(context, message) {
    const options = ['Delete Message', 'Copy Message', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Alert.alert(
              'Confirm',
              'sure want to delete this?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    firebaseSDK.delete(
                      message,
                      this.props.navigation.state.params.data.token,
                    );
                    this.setState(previousState => {
                      console.log(previousState);
                      return {
                        messages: previousState.messages.filter(
                          v => v._id !== message._id,
                        ),
                      };
                    });
                  },
                },
              ],
              {cancelable: false},
            );

            break;
          case 1:
            Clipboard.setString(message.text);
          default:
            break;
        }
      },
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
