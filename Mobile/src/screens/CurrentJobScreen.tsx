import {useState} from 'react';
import {View, Text, Button} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {JobType} from '../components/JobListComponent';

const CurrentJobScreen = () => {
  const [currentJob, setCurrentJob] = useState<JobType>();
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  return (
    <View>
      <Text style={{fontSize: 35}}>{currentJob?.title}</Text>
      <Text>Pickup Address</Text>
      <Text>Destination Address</Text>
      {currentJob != undefined ? (
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
      ) : null}
    </View>
  );
};

export default CurrentJobScreen;
