import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {
  Container,
  Form,
  Input,
  Item,
  Label,
  Button,
  Spinner,
  Content,
} from 'native-base';
import firebaseSDK from '../config/firebaseSDK';
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Entypo';

const Login = props => {
  const [input, setInput] = useState({});
  const [modalVisible, setmodalVisible] = useState(false);

  useEffect(() => {
    if (firebaseSDK.uid) {
      props.navigation.navigate('MainScreen');
    }
  }, []);

  const onPressLogin = async () => {
    setmodalVisible(true);
    if (input.email && input.password) {
      const response = firebaseSDK.login(input, loginSuccess, loginFailed);
    } else {
      alert('fill out the form first');
    }
  };

  const loginSuccess = () => {
    setmodalVisible(false);
    console.log('login successful, navigate to chat.');
    props.navigation.navigate('MainScreen');
  };

  const loginFailed = err => {
    setmodalVisible(false);
    alert('Login failure. Please tried again.' + err);
  };

  return (
    <Container style={{justifyContent: 'center'}}>
      <Content >
        <Text style={style.title}>Login</Text>
        <Icon name="sound" size={120} color="#00f"
        style={{alignSelf:'center'}} />
        <Form style={style.form}>
          <Label>Email</Label>
          <Item regular style={style.input}>
            <Input
              placeholder="email"
              keyboardType="email-address"
              value={input.email}
              onChangeText={e => {
                setInput({...input, email: e});
              }}
            />
          </Item>
          <Label>Password</Label>
          <Item regular style={style.input}>
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
            primary
            onPress={onPressLogin}
            style={{justifyContent: 'center',}}>
            <Text style={{color:'#fff'}}>Login</Text>
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
      </Content>
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,.1)',
            height: '100%',
            justifyContent: 'center',
          }}>
          <Spinner />
        </View>
      </Modal>
    </Container>
  );
};

export default Login;

const style = StyleSheet.create({
  form: {
    marginVertical:24,
    marginHorizontal: 30,
    height: 300,
    justifyContent: 'space-around',
  },
  title: {alignSelf: 'center', fontSize: 24, fontWeight: 'bold', color:'#0f0fff' ,marginVertical: 24},
  input:{borderRadius:4, backgroundColor:'#fafafafa'},
});
