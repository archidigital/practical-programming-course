import {PropsWithChildren, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Modal,
  Image,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import database from '@react-native-firebase/database';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

type ItemProps = {title: string};

type LocationType = {
  latitude: number;
  longitude: number;
};

enum StatusTypeEnum {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
}

export type JobType = {
  id: string;
  pickupAddress: LocationType;
  destinationAddress: LocationType;
  status: StatusTypeEnum;
  title: string;
  startTime?: number;
  completedTime?: number;
};

type JobListProps = {
  titlu: string;
};

function JobsListComponent(props: JobListProps): JSX.Element {
  const [currentJob, setCurrentJob] = useState<JobType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [DATA, setDATA] = useState<JobType[]>([]);
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  useEffect(() => {
    database()
      .ref('/jobList')
      .orderByChild('status')
      .equalTo(0)
      .on('value', snapshot => {
        const jobList: JobType[] = [];
        snapshot.forEach(jobDB => {
          const job: JobType = {
            ...jobDB.val(),
            id: jobDB.key,
          };
          jobList.push(job);
        });
        setDATA(jobList);

        // setDATA(prev => snapshot.val());
        //console.log('User data: ', snapshot.val());
      });
  }, []);

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

  useEffect(() => {
    (async () => {
      const hasLocationPermission = await requestLocationPermission();
      if (hasLocationPermission == 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            setMyLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            // currentJobLocations
            if (currentJob) {
              const jobID = currentJob.id;

              database()
                .ref('/currentJobLocations/' + jobID)
                .set({
                  currentLocation: position,
                })
                .then(() => console.log('Data set.'));

              console.log(position);
            }
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    })();
  }, []);

  //function deleteItem(title) {
  //  setDATA(prev => prev.filter(element => element.title !== title));
  //}

  function showDetails(job: JobType) {
    setCurrentJob(job);
    setModalVisible(true);
  }

  function renderJobItem(job: JobType) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{job.title}</Text>
        <Button title="Details" onPress={() => showDetails(job)}></Button>
      </View>
    );
  }

  const onStart = () => {
    database()
      .ref('/jobList/' + currentJob?.id)
      .update({
        status: StatusTypeEnum.IN_PROGRESS,
        startTime: new Date().getTime(),
      })
      .then(() => console.log('Data updated.'));
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={{fontSize: 40}}>{props.titlu}</Text>
      <FlatList
        data={DATA}
        renderItem={({item}) => renderJobItem(item)}
        //keyExtractor={item => item.id}
      />
      <Modal
        animationType="slide"
        //transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
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
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Button title="Start" onPress={() => onStart()}></Button>
          <Button title="Close" onPress={() => setModalVisible(false)}></Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
  },
});

export default JobsListComponent;
