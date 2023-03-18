import {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

const RegisterScreen = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');

  const registerUser = () => {
    const body = {
      name: userName,
      email: userEmail,
      password: userPassword,
    };

    fetch('http://10.0.2.2:8000/register', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('user data:', data);
        // setTestFromBackend(data.response);
      });
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 30, marginBottom: 20}}>Register</Text>

      <View style={{marginBottom: 20}}>
        <TextInput
          onChangeText={text => setUserName(text)}
          placeholder="User name"
          style={{borderWidth: 1, borderColor: '#dadada'}}></TextInput>
      </View>

      <View style={{marginBottom: 20}}>
        <TextInput
          onChangeText={text => setUserEmail(text)}
          placeholder="User email"
          style={{borderWidth: 1, borderColor: '#dadada'}}></TextInput>
      </View>

      <View style={{marginBottom: 20}}>
        <TextInput
          onChangeText={text => setUserPassword(text)}
          placeholder="Your password"
          secureTextEntry
          style={{borderWidth: 1, borderColor: '#dadada'}}></TextInput>
      </View>

      <View>
        <Button
          title="Register"
          onPress={() => {
            registerUser();
          }}></Button>
      </View>
    </View>
  );
};

export default RegisterScreen;
