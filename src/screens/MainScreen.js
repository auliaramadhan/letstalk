import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebaseSDK from '../config/firebaseSDK';
import {ListItem, Left, Thumbnail, Body} from 'native-base';

const MainScreen = props => {
  const [userList, setUserList] = useState({});
  useEffect(() => {
    firebaseSDK.userList(setUserList);
  }, []);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#006b3a" />
      <View style={styles.root}>
        {userList && (
          <FlatList
            data={userList}
            renderItem={({item}) => (
              <ListItem thumbnail>
                <Left style={{flex: 1, justifyContent: 'center'}}>
                  {item.avatar ? (
                    <Thumbnail source={{uri: item.avatar}} />
                  ) : (
                    <Icon name="user" size={48} />
                  )}
                </Left>
                <Body style={{flex: 5}}>
                  <Text style={styles.personName}>{item.name}</Text>
                  <Text style={styles.personChat}>{item.email}</Text>
                </Body>
              </ListItem>
            )}
            // keyExtractor={item => item.id.token}
          />
        )}
      </View>
    </>
  );
};

const contact = [
  {
    id: 1,
    name: 'User 1',
    chat: 'Hello',
  },
  {
    id: 2,
    name: 'User 2',
    chat: 'Hi',
  },
  {
    id: 3,
    name: 'User 3',
    chat: 'Bonjour',
  },
  {
    id: 4,
    name: 'User 4',
    chat: 'Namaste',
  },
  {
    id: 5,
    name: 'User 5',
    chat: 'Ni Hao',
  },
];

MainScreen.navigationOptions = {
  title: 'Chat',
};

const styles = StyleSheet.create({
  root: {},
  profilePic: {
    height: 50,
    width: 50,
    backgroundColor: '#eddbb9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  listChat: {
    padding: 20,
    marginBottom: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  personChat: {
    color: '#1f1f1f',
  },
});

export default MainScreen;
