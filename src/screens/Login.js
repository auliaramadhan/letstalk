import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Container, Form, Input, Item, Label, Button} from 'native-base';
import firebaseSDK from '../config/firebaseSDK';

const Login = props => {
  const [input, setInput] = useState({});


  useEffect(() => {
    if (firebaseSDK.uid) {
      props.navigation.navigate('MainScreen');
    }
  }, [])

  const onPressLogin = async () => {
    if (input.email && input.password) {
      const response = firebaseSDK.login(input, loginSuccess, loginFailed);
    } else {
      alert('fill out the form first')
    }

  };

  const loginSuccess = () => {
    console.log('login successful, navigate to chat.');
    props.navigation.navigate('MainScreen');
  };

  const loginFailed = (err) => {
    alert('Login failure. Please tried again.' + err);
  };

  return (
    <Container style={{justifyContent: 'center'}}>
      <Form style={style.form}>
        <Label>Email</Label>
        <Item regular>
          <Input
            placeholder="username"
            keyboardType="email-address"
            value={input.email}
            onChangeText={e => {
              setInput({...input, email: e});
            }}
          />
        </Item>
        <Label>Password</Label>
        <Item regular>
          <Input
            secureTextEntry={true}
            placeholder="password"
            value={input.password}
            onChangeText={e => {
              setInput({...input, password: e});
            }}
          />
        </Item>
        <Button
          success
          onPress={onPressLogin}
          style={{justifyContent: 'center'}}>
          <Text>Login</Text>
        </Button>
      </Form>
      <Button
        transparent
        style={{marginBottom: 20, justifyContent: 'center'}}
        onPress={() => props.navigation.navigate('Register')}>
        <Text style={{fontSize: 16}}>
          Dont have Account?{' '}
          <Text style={{textDecorationLine: 'underline'}}>Sign up here</Text>
        </Text>
      </Button>
    </Container>
  );
};

export default Login;

const style = StyleSheet.create({
  form: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginHorizontal: 30,
    height: 300,
    justifyContent: 'space-around',
  },
});
