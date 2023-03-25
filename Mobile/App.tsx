import React, {FC, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CurrentJobScreen from './src/screens/CurrentJobScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Tab = createBottomTabNavigator();

type MyTabsProps = {
  userId: string;
};

const MyTabs: FC<MyTabsProps> = props => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        children={() => <HomeScreen userId={props.userId} />}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Current Job" component={CurrentJobScreen} />
    </Tab.Navigator>
  );
};

function App(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MyTabs userId={userId} />
      ) : (
        <RegisterScreen
          loggedInSuccessfully={userId => {
            setIsLoggedIn(true);
            setUserId(userId);
          }}
        />
      )}
    </NavigationContainer>
  );
}

export default App;
