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
  accessToken: string;
  logOut: () => void;
};

const MyTabs: FC<MyTabsProps> = props => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        children={() => (
          <HomeScreen userId={props.userId} accessToken={props.accessToken} />
        )}
      />
      <Tab.Screen
        name="Settings"
        children={() => <SettingsScreen logOut={() => props.logOut()} />}
      />
      <Tab.Screen
        name="Current Job"
        children={() => <CurrentJobScreen userId={props.userId} />}
      />
    </Tab.Navigator>
  );
};

function App(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MyTabs
          userId={userId}
          accessToken={accessToken}
          logOut={() => {
            setIsLoggedIn(false);
            setUserId('');
          }}
        />
      ) : (
        <RegisterScreen
          loggedInSuccessfully={(userId, accessToken) => {
            setIsLoggedIn(true);
            setUserId(userId);
            setAccessToken(accessToken);
          }}
        />
      )}
    </NavigationContainer>
  );
}

export default App;
