import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Container, Form, Input, Item, Label, Button} from 'native-base';

const Login = props => {
  return (
    <Container style={{justifyContent: 'center'}}>
      <Form style={style.form}>
        <Label>Username</Label>
        <Item regular>
          <Input placeholder="username" />
        </Item>
        <Label>Password</Label>
        <Item regular>
          <Input secureTextEntry={true} placeholder="password" />
        </Item>
        <Button
          success
          onPress={() => props.navigation.navigate('MainScreen')}
          style={{justifyContent: 'center'}}>
          <Text>Login</Text>
        </Button>
      </Form>
      <Button
        transparent
        style={{marginBottom: 20, justifyContent: 'center'}}
        onPress={() => props.navigation.navigate('Login')}>
        <Text style={{fontSize: 16}}>
          Already have Account?{' '}
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
