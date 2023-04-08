import {FC, useEffect, useState} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {JobType, StatusTypeEnum} from '../components/JobListComponent';
import database from '@react-native-firebase/database';
import {useIsFocused} from '@react-navigation/native';

type CurrentJobScreenProps = {
  userId: string;
};

const CurrentJobScreen: FC<CurrentJobScreenProps> = props => {
  const isFocused = useIsFocused();

  const [currentJob, setCurrentJob] = useState<JobType>();
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  useEffect(() => {
    // get current job id
    database()
      .ref('/userCurrentJob/' + props.userId)
      .on('value', snapshot => {
        const currentJobId = snapshot.val();
        // get current job data
        database()
          .ref('/jobList/' + currentJobId)
          .on('value', snapshot => {
            setCurrentJob(snapshot.val());
          });
      });
  }, [isFocused]);

  const onEndJob = () => {
    const update = {
      ['/jobList/' + currentJob?.id]: {
        ...currentJob,
        status: StatusTypeEnum.COMPLETED,
        endTime: new Date().getTime(),
      },
      ['/userCurrentJob/' + props.userId]: null,
    };

    database()
      .ref('/')
      .update(update)
      .then(() => {
        setCurrentJob(undefined);
      });
  };

  return (
    <View>
      {currentJob != undefined ? (
        <>
          <Text style={{fontSize: 35}}>{currentJob?.title}</Text>
          <Text>Pickup Address</Text>
          <Text>Destination Address</Text>

          <MapView
            zoomControlEnabled={true}
            style={{width: '100%', height: '70%'}}
            initialRegion={{
              latitude:
                (currentJob.pickupAddress.latitude +
                  currentJob.destinationAddress.latitude) /
                2,
              longitude:
                (currentJob.pickupAddress.longitude +
                  currentJob.destinationAddress.longitude) /
                2,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}>
            <Marker
              title="Pickup Address"
              coordinate={{
                latitude: currentJob.pickupAddress.latitude,
                longitude: currentJob.pickupAddress.longitude,
              }}
            />

            <Marker
              title="Destination Address"
              coordinate={{
                latitude: currentJob.destinationAddress.latitude,
                longitude: currentJob.destinationAddress.longitude,
              }}
            />
            <Polyline
              coordinates={[
                {
                  latitude: currentJob.pickupAddress.latitude,
                  longitude: currentJob.pickupAddress.longitude,
                },
                {
                  latitude: currentJob.destinationAddress.latitude,
                  longitude: currentJob.destinationAddress.longitude,
                },
              ]}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={6}
            />
            {myLocation != undefined ? (
              <Marker
                title="My location"
                coordinate={{
                  latitude: myLocation?.latitude,
                  longitude: myLocation?.longitude,
                }}
              />
            ) : null}
          </MapView>
          <TouchableOpacity
            style={{backgroundColor: '#9ce1fc', marginTop: 20, padding: 10}}
            onPress={() => onEndJob()}>
            <Text style={{textAlign: 'center'}}>End Job</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{fontSize: 20, textAlign: 'center'}}>
          No job in progress
        </Text>
      )}
    </View>
  );
};

export default CurrentJobScreen;
