/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, ToastAndroid } from 'react-native';
import { Container, Form, Input, Item, Label, Button, Content, Spinner } from 'native-base';
import firebaseSDK from '../config/firebaseSDK';
import ImagePicker from 'react-native-image-picker'


const Register = props => {

  const [user, setUser] = useState({})
  const [loadImage, setLoadImage] = useState(false);

  const onPressCreate = async () => {
		try {
      setLoadImage(true)
			ToastAndroid.show('user being created please wait', ToastAndroid.SHORT);
			await firebaseSDK.createAccount(user);
      setLoadImage(false)
		} catch ({ message }) {
      console.log('create account failed. catch error:' + message);
			ToastAndroid.show('create account failed. catch error:' + message, ToastAndroid.SHORT);
      setLoadImage(false)
		}
	};

  const onImageUpload = () => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

		try {
      ImagePicker.showImagePicker(options, async (response) => {
        console.log('Response = ', response.uri);
        if (response.didCancel) {
          ToastAndroid.show('You cancelled image picker', ToastAndroid.SHORT);
        } else if (response.error) {
          ToastAndroid.show('ImagePicker Error: '+ response.error, ToastAndroid.SHORT);
        } else if (response.customButton) {
          ToastAndroid.show('User tapped custom button', ToastAndroid.SHORT);
        } else {
          const uri = decodeURI(response.uri)
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : response.path;
          setLoadImage(true);
          let uploadUrl = await firebaseSDK.uploadImage(uploadUri);
          await firebaseSDK.updateAvatar(uploadUrl);
          setLoadImage(false);
        }
      });
		} catch (err) {
      console.log('onImageUpload error:' + err.message);
			ToastAndroid.show('Upload image error:' + err.message, ToastAndroid.SHORT);
      setLoadImage(false);
		}
	};


  return (
    <Container style={{ justifyContent: 'center' }}>
      <Content>
      <Text style={style.title}>Register</Text>
        <Form style={style.form}>
          <Label>Email</Label>
          <Item regular>
            <Input placeholder="email"
            keyboardType='email-address'
              value={user.email}
              onChangeText={(v) => setUser({ ...user, email: v })}
            />
          </Item>
          <Label>Name</Label>
          <Item regular>
            <Input placeholder="username"
              value={user.name}
              onChangeText={(v) => setUser({ ...user, name: v })}
            />
          </Item>
          <Label>Password</Label>
          <Item regular>
            <Input secureTextEntry={true} placeholder="password"
              value={user.password}
              onChangeText={(v) => setUser({ ...user, password: v })}
            />
          </Item>
          <Button success onPress={onImageUpload} style={{ justifyContent: 'center' }}
          disabled={loadImage}>
          {loadImage && <Spinner style={style.loader} size={24} /> }
            <Text>upload</Text>
          </Button>
          <Button
            disabled={loadImage}
            success
            onPress={onPressCreate}
            style={{ justifyContent: 'center' }}>
            <Text>Register</Text>
          </Button>
        </Form>
      </Content>
      <Button
        transparent
        style={{ marginBottom: 20, justifyContent: 'center' }}
        onPress={() => props.navigation.navigate('Login')}>
        <Text style={{ fontSize: 16 }}>
          Already have Account?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Login here</Text>
        </Text>
      </Button>
    </Container>
  );
};

export default Register;

const style = StyleSheet.create({
  form: {
    marginTop: 30,
    marginBottom: 30,
    marginHorizontal: 30,
    height: 400,
    justifyContent: 'space-around',
  },
  title:{alignSelf:'center',fontSize:24,fontWeight:'bold', marginTop:32},
});
