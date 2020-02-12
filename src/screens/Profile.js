import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ToastAndroid,
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
  Spinner,
  List,
  Header,
  Title,
  Right,
} from 'native-base';
import firebaseSDK from '../config/firebaseSDK';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';

const Profile = props => {
  const [user, setUser] = useState({});
  const [initialData, setinitialData] = useState({});
  const [loadImage, setLoadImage] = useState(false);
  useEffect(() => {
    firebase
      .database()
      .ref('user')
      .child(firebaseSDK.uid)
      .on('value', data => {
        setUser(data.val());
        setinitialData(data.val());
      });
  }, []);

  const onImageUpload = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    if (loadImage) {
      ToastAndroid('please wait until finised', ToastAndroid.SHORT);
      return;
    }
    try {
      ImagePicker.showImagePicker(options, async response => {
        console.log(response);
        if (response.didCancel) {
          ToastAndroid.show('You cancelled image picker', ToastAndroid.SHORT);
        } else if (response.error) {
          ToastAndroid.show(
            'ImagePicker Error: ' + response.error,
            ToastAndroid.SHORT,
          );
        } else if (response.fileSize > 2 * 1024 * 1024) {
          ToastAndroid.show(
            'FIle must not be higher than 2 mb',
            ToastAndroid.LONG,
          );
        } else if (response.customButton) {
          ToastAndroid.show('User tapped custom button', ToastAndroid.SHORT);
        } else {
          const uri = decodeURI(response.uri);
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : response.path;
          setLoadImage(true);
          let uploadUrl = await firebaseSDK.uploadImage(uploadUri);
          await firebaseSDK.updateAvatar(uploadUrl);
          setLoadImage(false);
        }
      });
    } catch (err) {
      console.log('onImageUpload error:' + err.message);
      alert('Upload image error:' + err.message);
      setLoadImage(false);
    }
  };

  const updateProfile = async () => {
    setLoadImage(true);
    const userf = firebase.auth().currentUser;
    userf.updateProfile({displayName: user.name}).then(
      function() {
        firebase
          .database()
          .ref('user')
          .child(userf.uid)
          .update({name: user.name, phoneNumber: user.phoneNumber});
        ToastAndroid.show('edited', ToastAndroid.SHORT);
      },
      function(error) {
        ToastAndroid.show('error in database', ToastAndroid.SHORT);
      },
    );
    setLoadImage(false);
  };

  return (
    <Container>
      <Content>
        {loadImage && <Spinner style={style.loader} size={128} />}
        <Image
          style={{height: 128, width: 128, alignSelf: 'center', marginTop: 20}}
          borderRadius={64}
          source={{uri: user.avatar}}
        />
        <TouchableOpacity
          style={style.buttonCamera}
          onPress={onImageUpload}
          disabled={loadImage}>
          <Icon name="camera" size={24} color="white" />
        </TouchableOpacity>
        <Form style={style.form}>
          <Item>
            <Label>
              <Icon name="envelope" size={30} />{' '}
            </Label>
            <Input
              placeholder="email"
              disabled
              keyboardType="email-address"
              value={user.email}
              onChangeText={v => setUser({...user, email: v})}
            />
          </Item>
          <Item style={{marginTop: 12}}>
            <Label>
              <Icon name="user" size={24} />{' '}
            </Label>
            <Input
              placeholder="name"
              value={user.name}
              onChangeText={v => setUser({...user, name: v})}
            />
          </Item>
          <Item style={{marginTop: 12}}>
            <Label>
              <Icon name="phone" size={24} />{' '}
            </Label>
            <Input
              placeholder="phone Number"
              keyboardType="phone-pad"
              value={user.phoneNumber}
              onChangeText={v => setUser({...user, phoneNumber: v})}
            />
          </Item>
          {(initialData.name !== user.name ||
            initialData.phoneNumber !== user.phoneNumber) &&
            !loadImage && (
              <Button
                primary
                onPress={updateProfile}
                style={{justifyContent: 'center', marginTop: 8}}>
                <Text style={{color: '#fff'}}>Update</Text>
              </Button>
            )}
        </Form>
        <Button
          onPress={() => firebaseSDK.onLogout(props.navigation.navigate)}
          primary
          style={{justifyContent: 'center', margin: 16, marginTop: 32}}>
          <Text style={{color: '#fff'}}>Logout</Text>
        </Button>
      </Content>
    </Container>
  );
};

export default Profile;

const style = StyleSheet.create({
  form: {
    marginVertical: 24,
    padding: 8,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    zIndex: 999,
    alignSelf: 'center',
    marginTop: 44,
  },
  buttonCamera: {
    alignSelf: 'center',
    marginTop: -20,
    marginLeft: 64,
    backgroundColor: '#00c',
    padding: 8,
    borderRadius: 30,
    zIndex: 999,
  },
});
