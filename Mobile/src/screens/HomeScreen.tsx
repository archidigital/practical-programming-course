import React, {FC, useEffect, useState} from 'react';
import {Button, PermissionsAndroid, Text, View} from 'react-native';
import JobsListComponent from '../components/JobListComponent';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';

type HomeScreenProps = {
  userId: string;
};

const HomeScreen: FC<HomeScreenProps> = props => {
  const [started, setStarted] = useState<boolean>(false);

  const requestLocationPermission = async () => {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };

  const onPressStartShift = async () => {
    // request permission
    console.log('onPressStartShift', onPressStartShift);
    const hasLocationPermission = await requestLocationPermission();
    if (hasLocationPermission == 'granted') {
      setStarted(true);
      Geolocation.getCurrentPosition(
        position => {
          // send location data to firebase (via userId)
          database()
            .ref('/locations/' + props.userId)
            .update({
              currentLocation: position,
            })
            .then(() => console.log('Data set.'));

          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000},
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      <JobsListComponent titlu="Jobs List" />
      <Button
        onPress={() => onPressStartShift()}
        title={started ? 'End shift' : 'Start shift'}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        style={{position: 'fixed', bottom: 0}}
      />
    </View>
  );
};

export default HomeScreen;
