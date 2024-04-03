import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './components/Home';
import { useContext } from 'react';
import { MainContext } from './contexts/MainContext';
import Login from './components/Login';
import Profile from './components/Profile';

export default function Index() {

  const Drawer = createDrawerNavigator()

  const { user } = useContext(MainContext)

  return (
    <NavigationContainer>
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={Home}/>
            <Drawer.Screen name={user ? "Profile" : "Login"} component={user ? Profile : Login} />
        </Drawer.Navigator>
    </NavigationContainer>
  );
}
