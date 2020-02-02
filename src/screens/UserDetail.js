import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Container,
  Content,
  Item,
  Label,
  Input,
  Form,
  Button,
  ListItem,
  Body,
  Left,
} from 'native-base';
import firebaseSDK from '../config/firebaseSDK';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';

const Profile = props => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const {
      name: displayName,
      phoneNumber,
      email,
      avatar: photoURL,
    } = props.navigation.state.params.data;
    setUser({displayName, phoneNumber, email, photoURL});
  }, []);

  console.log(user);

  return (
    <Container>
      <Content>
        <Form style={style.form}>
          {user.photoURL && (
            <Image
              style={{height: 128, width: 128, alignSelf: 'center'}}
              borderRadius={64}
              source={{uri: user.photoURL}}
            />
          )}
          {!user.photoURL && (
            <Icon name="user" size={128} style={{alignSelf: 'center'}} />
          )}
          <ListItem thumbnail noBorder>
            <Icon name="envelope" size={30} />
            <Body>
              <Item stackedLabel>
                <Label>Email</Label>
                <Input
                  placeholder="email"
                  disabled
                  keyboardType="email-address"
                  value={user.email}
                  onChangeText={v => setUser({...user, email: v})}
                />
              </Item>
            </Body>
          </ListItem>
          <ListItem thumbnail noBorder>
            <Icon name="user" size={30} />
            <Body>
              <Item stackedLabel>
                <Label>Name</Label>
                <Input
                  placeholder="username"
                  value={user.displayName}
                  onChangeText={v => setUser({...user, displayName: v})}
                />
              </Item>
            </Body>
          </ListItem>
          <ListItem thumbnail noBorder>
            <Icon name="phone" size={30} />
            <Body>
              <Item stackedLabel>
                <Label>Phone Number</Label>
                <Input
                  placeholder="phone Number"
                  value={user.phoneNumber}
                  onChangeText={v => setUser({...user, phoneNumber: v})}
                />
              </Item>
            </Body>
          </ListItem>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;

const style = StyleSheet.create({
  form: {
    padding: 8,
    justifyContent: 'center',
  },
  buttonCamera: {
    alignSelf: 'center',
    marginTop: -20,
    marginLeft: 64,
    backgroundColor: '#070',
    padding: 8,
    borderRadius: 30,
    zIndex: 999,
  },
});
