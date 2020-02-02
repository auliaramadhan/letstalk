import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Container} from 'native-base';
import firebaseSDK from '../config/firebaseSDK';
import firebase from 'react-native-firebase';

// const Chat = (props) => {

//   const [messages, setMessages] = useState([])
//   useEffect(() => {
//     firebaseSDK.on(props.navigation.state.params.data.token,
//       newMessage => setMessages(GiftedChat.append( messages,newMessage)))
//   }, [])

//   return (

//   );
// };

class Chat extends React.Component<Props> {
  state = {
    messages: [],
  };
  render() {
    return (
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
    );
  }

  componentDidMount() {
    firebaseSDK.on(this.props.navigation.state.params.data.token ,
       message =>
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
