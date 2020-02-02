import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {Container, Form, Input, Item, Label, Button, Spinner} from 'native-base';
import firebaseSDK from '../config/firebaseSDK';

const Login = props => {
  const [input, setInput] = useState({});
  const [modalVisible, setmodalVisible] = useState(false)
  

  useEffect(() => {
    if (firebaseSDK.uid) {
      props.navigation.navigate('MainScreen');
    }
  }, []);

  const onPressLogin = async () => {
    setmodalVisible(true)
    if (input.email && input.password) {
      const response = firebaseSDK.login(input, loginSuccess, loginFailed);
    } else {
      alert('fill out the form first');
    }
  };

  const loginSuccess = () => {
    setmodalVisible(false)
    console.log('login successful, navigate to chat.');
    props.navigation.navigate('MainScreen');
  };

  const loginFailed = err => {
    setmodalVisible(false)
    alert('Login failure. Please tried again.' + err);
  };

  return (
    <Container style={{justifyContent: 'center'}}>
      <Text style={style.title}>Login</Text>
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
      <Modal animationType="slide" transparent visible={modalVisible}>
          <View style={{backgroundColor:'rgba(0,0,0,.1)', height:'100%', justifyContent:'center'}}>
          <Spinner />
          </View>
      </Modal>
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
  title:{alignSelf:'center',fontSize:24,fontWeight:'bold', marginTop:32}
});
