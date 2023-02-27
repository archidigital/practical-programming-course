import React, {useEffect} from 'react';
import {
  Alert,
  Button,
  PermissionsAndroid,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import JobsListComponent from './src/components/JobListComponent';

function App(): JSX.Element {
  const a = 11;
  const b = 22;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function onPressLearnMore() {
    Alert.alert('Test button');
  }

  function sum(a, b) {
    return a * b;
  }

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 50}}>Home</Text>

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
}

export default App;
