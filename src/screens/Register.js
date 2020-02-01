/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Container, Form, Input, Item, Label, Button, Content } from 'native-base';
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
          alert('User cancelled image picker');
        } else if (response.error) {
          alert('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          alert('User tapped custom button: ', response.customButton);
        } else {
          const uri = decodeURI(response.uri)
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : response.path;
          let uploadUrl = await firebaseSDK.uploadImage(uploadUri);
          // setUser({...user, avatar: uploadUrl });
          // console.log(user)
          await firebaseSDK.updateAvatar(uploadUrl);
        }
      });
		} catch (err) {
			console.log('onImageUpload error:' + err.message);
			alert('Upload image error:' + err.message);
		}
	};


  return (
    <Container style={{ justifyContent: 'center' }}>
      <Content>
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
          <Button success onPress={onImageUpload} style={{ justifyContent: 'center' }}>
            <Text>upload</Text>
          </Button>
          <Button
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
});
