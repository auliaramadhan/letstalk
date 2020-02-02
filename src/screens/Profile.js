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
      displayName,
      phoneNumber,
      email,
      photoURL,
    } = firebase.auth().currentUser;
    setUser({displayName, phoneNumber, email, photoURL});
  }, []);

  console.log(user);

  const onImageUpload = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    try {
      ImagePicker.showImagePicker(options, async response => {
        console.log('Response = ', response.uri);
        if (response.didCancel) {
          alert('User cancelled image picker');
        } else if (response.error) {
          alert('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          alert('User tapped custom button: ', response.customButton);
        } else {
          const uri = decodeURI(response.uri);
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : response.path;
          let uploadUrl = await firebaseSDK.uploadImage(uploadUri);
          await firebaseSDK.updateAvatar(uploadUrl);
        }
      });
    } catch (err) {
      console.log('onImageUpload error:' + err.message);
      alert('Upload image error:' + err.message);
    }
  };

  const updateProfile = async () => {
    const userf = firebase.auth().currentUser;
    userf.updateProfile({displayName: user.displayName}).then(
      function() {
        firebase
          .database()
          .ref('user')
          .child(userf.uid)
          .update({name: user.displayName, phone:user.phoneNumber});
        alert('edited');
      },
      function(error) {
        alert('error in database');
        console.warn('Error update displayName.');
      },
    );
  };

  return (
    <Container>
      <Content>
        <Form style={style.form}>
          <Image
            style={{height: 128, width: 128, alignSelf: 'center'}}
            borderRadius={64}
            source={{uri: user.photoURL}}
          />
          <TouchableOpacity style={style.buttonCamera}>
            <Icon name="camera" size={24} color="white" />
          </TouchableOpacity>
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
          <Button
            onPress={()=>firebaseSDK.onLogout(props.navigation.navigate)}
            success
            style={{justifyContent: 'center'}}>
            <Text>Logout</Text>
          </Button>
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
