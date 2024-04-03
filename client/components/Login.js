import { useState, useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { MainContext } from '../contexts/MainContext';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login({navigation}) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [page, setPage] = useState("login")
    
    const {API, user, setUser, theme} = useContext(MainContext)

    const login = async () => {

        setError(null)
    
        const res = await fetch(`${API}/user/login`, {
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
          await AsyncStorage.setItem('user', JSON.stringify(data))
          setUser(data)
        }
      };

    const register = async () => {
  
      setError(null);
  
      const res = await fetch(`${API}/user/register`, {
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
        AsyncStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      }
    };
    
      useEffect(()=>{
        if (user) navigation.navigate("Home")
      }, [user])

    return (
        <View style={{flex: 1}}>
            {page === "login" ? 
            <View style={styles.container}>
              <TextInput style={styles.input} placeholder='Email' onChangeText={(t)=>setEmail(t)}/>
              <TextInput style={styles.input} secureTextEntry={true} placeholder='Password' onChangeText={(t)=>setPassword(t)}/>
              {error && <Text style={styles.error}>{error}</Text>}
              <Button title="Log in" color={theme} onPress={login}/>
              <Text style={{alignSelf: 'center'}}>Not a member yet? <Text onPress={()=>{
                setPage("register")
                setError(null)
              }} style={{color: theme}}>Register</Text></Text>
            </View>
            :
            <View style={styles.container}>
              <TextInput style={styles.input} placeholder='Name' onChangeText={(t)=>setName(t)}/>
              <TextInput style={styles.input} placeholder='Email' onChangeText={(t)=>setEmail(t)}/>
              <TextInput style={styles.input} secureTextEntry={true} placeholder='Password' onChangeText={(t)=>setPassword(t)}/>
              {error && <Text style={styles.error}>{error}</Text>}
              <Button title="Register" color={theme} onPress={register}/>
              <Text style={{alignSelf: 'center'}}>Already a member? <Text onPress={()=>{
                setPage("login")
                setError(null)
              }} style={{color: theme}}>Login</Text></Text>
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
        // borderColor: 'red';
        // borderWidth: 1px;
        // border-style: solid;
        borderRadius: 8
    }
})

function LoginPage(props) {

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={e => login(e)}>
        <input className="loginInput"
          type="text"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input className="loginInput"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginButton">Login</button>
        {error && <div className="login-error">{error}</div> }
        <div style={{ color: "grey", fontSize: 14 }}>
          Don't have an account yet?&nbsp;
          <Link to={"/register"} style={{ color: "#f5385d" }}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
