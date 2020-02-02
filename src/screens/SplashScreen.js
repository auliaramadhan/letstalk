import React, {useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import firebaseSDK from '../config/firebaseSDK';

const SplashScreen = props => {
  useEffect(() => {
    setTimeout(() => {
      if (firebaseSDK.uid) {
        props.navigation.navigate('MainScreen');
      }else props.navigation.navigate('Login');
    }, 2000);
  }, [props.navigation]);
  return (
    <>
      <StatusBar hidden />
      <View style={styles.root}>
        <Icon name="sound" size={120} color="#fff" />
        <Text style={styles.text}>Lets Talk</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#006b3a',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
  },
});

export default SplashScreen;
