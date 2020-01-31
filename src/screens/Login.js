import React from 'react';
import {View, Text} from 'react-native';
import {Container, Form, Input, Item, Label, Button} from 'native-base';

const Login = props => {
  return (
    <Container>
      <Form>
        <Item stackedLabel>
          <Label>Username</Label>
          <Input placeholder="username" />
        </Item>
        <Item stackedLabel>
          <Label>Password</Label>
          <Input secureTextEntry={true} placeholder="password" />
        </Item>
        <Button success onPress={() => props.navigation.navigate('MainScreen')}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
