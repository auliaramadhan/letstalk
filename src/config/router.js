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

const ChatStack = createStackNavigator({
  MainScreen,
});

const LocationStack = createStackNavigator({
  ContactLocation,
});

const ProfileStack = createStackNavigator({
  Profile,
});

const AuthStack = createStackNavigator({
   Login

})

const BottomTab = createBottomTabNavigator({
  ChatStack: {
    screen: ChatStack,
    navigationOptions: {
      title: 'Chat',
      tabBarIcon: ({focused, horizontal, tintColor}) => (
        <Icon name="comments" color={tintColor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#006b3a',
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
        activeTintColor: '#006b3a',
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
        activeTintColor: '#006b3a',
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

const SwitchContainer = createSwitchNavigator({
  SplashScreen,
  BottomTab,
  AuthStack,
},{
   initialRouteName:'AuthStack'
}
);

const AppContainer = createAppContainer(SwitchContainer);
export default AppContainer;
