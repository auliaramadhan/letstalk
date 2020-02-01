/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Form, Input, Item, Label, Button } from 'native-base';
import firebaseSDK from '../config/firebaseSDK';
import ImagePicker from 'react-native-image-picker'


const Register = props => {

  const [user, setUser] = useState({})

  const onPressCreate = async () => {
		try {
			await firebaseSDK.createAccount(user);
			alert('create user success:');
		} catch ({ message }) {
			console.log('create account failed. catch error:' + message);
			alert('create account failed. catch error:' + message);
		}
	};

  const onImageUpload = async () => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

		try {
			// only if user allows permission to camera roll
			// if (cameraRollPerm === 'granted') {
      // }

      await ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
          alert('User cancelled image picker');
        } else if (response.error) {
          alert('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          alert('User tapped custom button: ', response.customButton);
        } else {
          setUser({...user, avatar : response.uri,});
        }
      });
      let uploadUrl = await firebaseSDK.uploadImage(user.avatar);
      setUser({...user, avatar: uploadUrl });
      await firebaseSDK.updateAvatar(uploadUrl);
		} catch (err) {
			console.log('onImageUpload error:' + err.message);
			alert('Upload image error:' + err.message);
		}
	};


  return (
    <Container style={{ justifyContent: 'center' }}>
      <Form style={style.form}>
        <Label>Email</Label>
        <Item regular>
          <Input placeholder="username"
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
        <Button success onPress={onImageUpload} style={{ justifyContent: 'center' }}>
          <Text>upload</Text>
        </Button>
        <Button
          success
          onPress={onPressCreate}
          style={{ justifyContent: 'center' }}>
          <Text>Login</Text>
        </Button>
      </Form>
      <Button
        transparent
        style={{ marginBottom: 20, justifyContent: 'center' }}
        onPress={() => props.navigation.navigate('Login')}>
        <Text style={{ fontSize: 16 }}>
          Already have Account?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Sign up here</Text>
        </Text>
      </Button>
    </Container>
  );
};

export default Register;

const style = StyleSheet.create({
  form: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginHorizontal: 30,
    height: 400,
    justifyContent: 'space-around',
  },
});
