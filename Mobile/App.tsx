import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}


type ItemProps = { title: string };


type DataType = {
  id: string;
  title: string;
};

type JobListProps = {
  titlu: string;
};

function JobsListComponent(props: JobListProps): JSX.Element {
  const [currentJob, setCurrentJob] = useState();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [DATA, setDATA] = useState<DataType[]>([
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Job',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Job',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Job',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '4 Job',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '5 Job',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '6 Job',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '7 Job',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '8 Job',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: '9 Job',
    },
  ]);

  function deleteItem(title) {
    setDATA(prev => prev.filter(element => element.title !== title));
  }

  function showDetails(title) {
    setCurrentJob(title);
    setModalVisible(true);
  }

  function renderJobItem({ title }: ItemProps) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Button title='Details' onPress={() => showDetails(title)}></Button>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ fontSize: 40 }}>{props.titlu}</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => renderJobItem(item)}
        keyExtractor={item => item.id}
      />
      <Modal
        animationType="slide"
        //transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Text style={{ fontSize: 35 }}>{currentJob}</Text>
        <Text>Pickup Address</Text>
        <Text>Destination Address</Text>
        <Image
          source={require('./map.png')}
        />
        <Button title='Close' onPress={() => setModalVisible(false)}></Button>
      </Modal>
    </View>
  );
}



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function onPressLearnMore() {
    Alert.alert('Test button');
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 50 }}>Home</Text>

      <JobsListComponent titlu="Jobs List" />

      <Button
        onPress={onPressLearnMore}
        title="Start shift"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        style={{ position: 'fixed', bottom: 0 }}
      />
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
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 32,
  },
});

export default App;
