import { useState, useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { MainContext } from '../contexts/MainContext';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login({navigation}) {

  // login / register fields
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // state for error
    const [error, setError] = useState("");

    // state to know whether to show login screen or register screen
    const [loggingIn, setLoggingIn] = useState(true)
    
    // import from context
    const {API, user, setUser, theme} = useContext(MainContext)

    const login = async () => { // function to log user in

        setError(null)
    
        const res = await fetch(`${API}/user/login`, { // post user to server
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
          })
        })
        
        const data = await res.json()
    
        if (!res.ok){
          console.log("res not ok: " + data.error)
          setError(data.error)
        } else {
          await AsyncStorage.setItem('user', JSON.stringify(data)) // if res ok, save user to storage
          setUser(data)
          navigation.navigate("Home") // once logged in, navigate to home screen
        }
      };

    const register = async () => { // function to register user
  
      setError(null);
  
      const res = await fetch(`${API}/user/register`, { // post user to server
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.log("res not ok: " + data.error);
        setError(data.error);
      } else {
        await AsyncStorage.setItem("user", JSON.stringify(data)); // if res ok, save user to storage, automatically logging them in
        setUser(data);
        navigation.navigate("Home") // after registering, navigate to home
      }
    };

    return (
        <View style={{flex: 1}}>
            {loggingIn ? // if user wants to log in
            <View style={styles.container}>
              <TextInput style={styles.input} placeholder='Email' onChangeText={(t)=>setEmail(t)}/>
              <TextInput style={styles.input} secureTextEntry={true} placeholder='Password' onChangeText={(t)=>setPassword(t)}/>
              {error && <Text style={styles.error}>{error}</Text>}
              <Button title="Log in" color={theme} onPress={login}/>
              <Text style={{alignSelf: 'center'}}>Not a member yet?
                <Text onPress={()=>{
                setLoggingIn(false) // change to Register view if click
                setError(null)
                }} style={{color: theme}}>Register
                </Text>
              </Text>
            </View>
            : // if user wants to register
            <View style={styles.container}>
              <TextInput style={styles.input} placeholder='Name' onChangeText={(t)=>setName(t)}/>
              <TextInput style={styles.input} placeholder='Email' onChangeText={(t)=>setEmail(t)}/>
              <TextInput style={styles.input} secureTextEntry={true} placeholder='Password' onChangeText={(t)=>setPassword(t)}/>
              {error && <Text style={styles.error}>{error}</Text>}
              <Button title="Register" color={theme} onPress={register}/>
              <Text style={{alignSelf: 'center'}}>Already a member?
                <Text onPress={()=>{
                  setLoggingIn(true) // change back to Login view if click
                  setError(null)
                  }} style={{color: theme}}>Login
                </Text>
              </Text>
            </View>}
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 200,
        gap: 20,
        flex: 1
    },
    input: {
        margin: 0,
        height: 50,
        borderRadius: 8,
        borderColor: 'grey',
        padding: 10,
        backgroundColor: 'white'
    },
    error: {
        backgroundColor: '#ffb8b8',
        width: '70%',
        paddingVertical: 20,
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 16,
        borderRadius: 8
    }
})