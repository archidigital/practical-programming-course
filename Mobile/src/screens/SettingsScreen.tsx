import {FC} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

type SettingsScreenProps = {
  logOut: () => void;
};

const SettingsScreen: FC<SettingsScreenProps> = props => {
  const onLogout = () => {
    props.logOut();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onLogout();
        }}
        style={{backgroundColor: '#f9c2ff', padding: 10, marginTop: 10}}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
