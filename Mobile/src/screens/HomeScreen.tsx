import React, {FC, useEffect, useState} from 'react';
import {Button, PermissionsAndroid, Text, View} from 'react-native';
import JobsListComponent from '../components/JobListComponent';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';

type HomeScreenProps = {
  userId: string;
  accessToken: string;
};

const HomeScreen: FC<HomeScreenProps> = props => {
  const [started, setStarted] = useState<boolean>(false);
  const [watchId, setWatchId] = useState<number>();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    fetch('https://web.riderapp.ro/api/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + props.accessToken,
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserName(data.response.name);
      });
  }, [props.accessToken]);

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
    // console.log('onPressStartShift', onPressStartShift);
    const hasLocationPermission = await requestLocationPermission();
    if (hasLocationPermission == 'granted') {
      setStarted(!started);

      if (!started) {
        const watchId = Geolocation.watchPosition(
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
          {enableHighAccuracy: true, interval: 3000},
        );
        setWatchId(watchId);
      } else {
        if (watchId != undefined) {
          Geolocation.clearWatch(watchId);
        }
      }
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <JobsListComponent titlu={`Hello, ${userName}`} userId={props.userId} />
      <Button
        onPress={() => onPressStartShift()}
        title={started ? 'End shift' : 'Start shift'}
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
};

export default HomeScreen;
