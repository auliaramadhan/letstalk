import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebaseSDK from '../config/firebaseSDK';
import {
  ListItem,
  Left,
  Thumbnail,
  Body,
  Content,
  Container,
  Spinner,
  Header,
  Button,
  Title,
  Right,
  Icon as IconNative,
} from 'native-base';

const MainScreen = props => {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    firebaseSDK.userList(setUserList);
  }, []);

  return (
    <Container>
      <Header>
        <Left>
          {/* <Button transparent>
            <IconNative name="arrow-back" />
          </Button> */}
        </Left>
        <Body>
          <Title>Chat</Title>
        </Body>
        <Right>
          {/* <Button>
            <Text >Cancel</Text>
          </Button> */}
        </Right>
      </Header>
      {/* <StatusBar barStyle="light-content" backgroundColor="#006b3a" /> */}
      {userList.length === 0 && <Spinner />}
      {userList && (
        <FlatList
          data={userList}
          renderItem={({item}) => (
            <ListItem
              thumbnail
              onPress={() => props.navigation.navigate('Chat', {data: item})}
              button>
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
          keyExtractor={item => item.token}
        />
      )}
    </Container>
  );
};

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
