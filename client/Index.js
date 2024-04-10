import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './components/Home';
import { useContext, useState } from 'react';
import { MainContext } from './contexts/MainContext';
import Login from './components/Login';
import Profile from './components/Profile';

export default function Index() {

  const Drawer = createDrawerNavigator()

  // import user from context
  const { user } = useContext(MainContext)
  // variable for showing drawer header
  const [showHeader, setShowHeader] = useState(false)

  return (
    <NavigationContainer>
        <Drawer.Navigator screenOptions={{headerShown: showHeader ? true : false}}>
            <Drawer.Screen initialParams={{setShowHeader}} name="Home" component={Home}/>
            {/* if user is logged in, displays Profile, otherwise displays Login */}
            <Drawer.Screen name={user ? "Profile" : "Login"} component={user ? Profile : Login} />
        </Drawer.Navigator>
    </NavigationContainer>
  );
}
