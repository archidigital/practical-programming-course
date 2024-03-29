import {FC, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

type RegisterScreenProps = {
  loggedInSuccessfully: (userId: string, accessToken: string) => void;
};

const RegisterScreen: FC<RegisterScreenProps> = props => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');

  const [loginUserEmail, setLoginUserEmail] = useState<string>('');
  const [loginUserPassword, setLoginUserPassword] = useState<string>('');

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const loginUser = () => {
    const body = {
      email: loginUserEmail,
      password: loginUserPassword,
    };
    fetch('https://web.riderapp.ro/api/login', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.response.success == true) {
          const userId = data.response.userId;
          const token = data.response.token;
          props.loggedInSuccessfully(userId, token);
        }
      });
  };

  const registerUser = () => {
    const body = {
      name: userName,
      email: userEmail,
      password: userPassword,
    };

    fetch('https://web.riderapp.ro/api/register', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.response.success === true) {
          setMessage('User registered successfully!');
          setUserName('');
          setUserEmail('');
          setUserPassword('');
        } else {
          setError(data.response.message);
        }

        Keyboard.dismiss();
      });
  };

  const RegisterForm = () => {
    return (
      <>
        <Text style={{fontSize: 30, marginBottom: 20}}>Register</Text>

        <View style={{marginBottom: 20}}>
          <TextInput
            value={userName}
            onChangeText={text => setUserName(text)}
            placeholder="User name"
            style={{borderWidth: 1, borderColor: '#dadada'}}></TextInput>
        </View>

        <View style={{marginBottom: 20}}>
          <TextInput
            value={userEmail}
            onChangeText={text => setUserEmail(text)}
            placeholder="User email"
            style={{borderWidth: 1, borderColor: '#dadada'}}></TextInput>
        </View>

        <View style={{marginBottom: 20}}>
          <TextInput
            value={userPassword}
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
          {message && (
            <Text style={{fontSize: 21, color: '#8fce00', marginTop: 10}}>
              {message}
            </Text>
          )}
          {error && (
            <Text style={{fontSize: 21, color: '#802000', marginTop: 10}}>
              {error}
            </Text>
          )}
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => {
              setIsLoggingIn(!isLoggingIn);
            }}>
            <Text style={{fontSize: 21, textDecorationLine: 'underline'}}>
              Already have an Account? Login here
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const LoginForm = () => {
    return (
      <>
        <Text style={{fontSize: 30, marginBottom: 20}}>Login</Text>

        <View style={{marginBottom: 20}}>
          <TextInput
            onChangeText={text => setLoginUserEmail(text)}
            placeholder="User email"
            style={{borderWidth: 1, borderColor: '#dadada'}}></TextInput>
        </View>

        <View style={{marginBottom: 20}}>
          <TextInput
            onChangeText={text => setLoginUserPassword(text)}
            placeholder="Your password"
            secureTextEntry
            style={{borderWidth: 1, borderColor: '#dadada'}}></TextInput>
        </View>

        <View>
          <Button
            title="Login"
            onPress={() => {
              loginUser();
            }}></Button>

          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => {
              setIsLoggingIn(!isLoggingIn);
            }}>
            <Text style={{fontSize: 21, textDecorationLine: 'underline'}}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={{padding: 20}}>
      {isLoggingIn ? LoginForm() : RegisterForm()}
    </View>
  );
};

export default RegisterScreen;
