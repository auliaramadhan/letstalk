import React from 'react';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import SplashScreen from '../screens/SplashScreen';

import MainScreen from '../screens/MainScreen';
import ContactLocation from '../screens/ContactLocation';
import Profile from '../screens/Profile';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Chat from '../screens/Chat';
import UserDetail from '../screens/UserDetail';

const ChatStack = createStackNavigator({
  MainScreen,
},{headerMode:'none'});

const LocationStack = createStackNavigator({
  ContactLocation,
},{headerMode:'none'});

const ProfileStack = createStackNavigator(
  {
    Profile,
  },
  {
    headerMode: 'none',
  },
);

const AuthStack = createStackNavigator({
  Login,
  Register,
},{
  headerMode:'none'
});

const BottomTab = createBottomTabNavigator({
  ChatStack: {
    screen: ChatStack,
    navigationOptions: {
      title: 'Chat',
      tabBarIcon: ({focused, horizontal, tintColor}) => (
        <Icon name="comments" color={tintColor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#00b',
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
  LocationStack: {
    screen: LocationStack,
    navigationOptions: {
      title: 'Locations',
      tabBarIcon: ({focused, horizontal, tintColor}) => (
        <Icon name="map-marker" color={tintColor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#00b',
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
  ProfileStack: {
    screen: ProfileStack,
    navigationOptions: {
      title: 'Profile',
      tabBarIcon: ({focused, horizontal, tintColor}) => (
        <Icon name="user" color={tintColor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#00b',
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

const AppStack = createStackNavigator(
  {
    BottomTab,
    Chat,
    UserDetail
  },{
   headerMode:'none' 
  }
)

const SwitchContainer = createSwitchNavigator(
  {
    // SplashScreen:{screen:SplashScreen},
    AppStack,
    AuthStack,
  },
  {
    initialRouteName: 'AuthStack',
  },
);

const AppContainer = createAppContainer(SwitchContainer);
export default AppContainer;
