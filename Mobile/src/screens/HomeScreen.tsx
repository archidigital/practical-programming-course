import React, {useEffect} from 'react';
import {Button, View} from 'react-native';
import JobsListComponent from '../components/JobListComponent';

const HomeScreen = () => {
  const a = 11;
  const b = 22;

  function onPressLearnMore() {
    // Alert.alert('Test button');
  }

  useEffect(() => {
    fetch('http://10.0.2.2:8000/hello?name=robert')
      .then(response => response.json())
      .then(data => {
        console.log('data from backend', data);
        // setTestFromBackend(data.response);
      });
    // communicate with backend
    // http://localhost:8000/
    // setTestFromBackend
  }, []);

  return (
    <View style={{flex: 1}}>
      <JobsListComponent titlu="Jobs List" />

      <Button
        onPress={onPressLearnMore}
        title="Start shift"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        style={{position: 'fixed', bottom: 0}}
      />
    </View>
  );
};

export default HomeScreen;
