import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'react-native-firebase';
import firebaseSDK from '../config/firebaseSDK';
import {Spinner, Container} from 'native-base';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Maps extends Component {
  state = {
    initial: 'state',
    mapRegion: null,
    latitude: 0,
    longitude: 0,
    userList: [],
    uid: null,
  };

  componentDidMount = async () => {
    await this.getUser();
    await this.getLocation();
  };

  getUser = async () => {
    const uid = await firebaseSDK.uid;
    this.setState({uid: uid});
    firebase
      .database()
      .ref('user')
      .on('child_added', result => {
        let data = result.val();
        console.log('hasi ', data);
        if (data !== null && data.token != uid) {
          this.setState(prevData => {
            return {userList: [...prevData.userList, data]};
          });
        }
      });
  };

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421 * 1.5,
          };
          firebase
            .database()
            .ref('user')
            .child(firebaseSDK.uid)
            .update({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
            .then(data => {
              ToastAndroid.show(
                'your location has been updated',
                ToastAndroid.SHORT,
              );
            });
          this.setState({
            mapRegion: region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
        },
        error => {
          this.setState({errorMessage: error});
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  render() {
    console.log(this.state.userList);
    return (
      <Container>
        {this.state.userList === 0 ?<Spinner />
        : (
          <MapView
            style={{width: '100%', height: '100%'}}
            showsMyLocationButton={true}
            showsIndoorLevelPicker={true}
            showsUserLocation={true}
            zoomControlEnabled={true}
            showsCompass={true}
            showsTraffic={true}
            region={this.state.mapRegion}
            initialRegion={{
              latitude: -7.755322,
              longitude: 110.381174,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}>
            {this.state.userList.map(item => (
              <Marker
                key={item.token}
                title={item.name}
                draggable
                coordinate={{
                  latitude: item.latitude || 0,
                  longitude: item.longitude || 0,
                }}
                onCalloutPress={() => {
                  this.props.navigation.navigate('UserDetail', {
                    data: item,
                  });
                }}>
                <View>
                  <Image
                    source={{uri: item.avatar}}
                    style={{width: 40, height: 40, borderRadius: 50}}
                  />
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </Container>
    );
  }
}
