import React, { useContext, useEffect, useState } from "react";
import { Button, View, FlatList } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainContext } from "../contexts/MainContext";
import AdCard from "./AdCard";
import Ad from "./Ad";
import CreateAd from "./CreateAd";
import SearchBar from "./SearchBar";
import * as Progress from 'react-native-progress'

function Home({ navigation }) {

  const Stack = createNativeStackNavigator();

  const { API, user, theme, updated } = useContext(MainContext); // import from context
  const [ads, setAds] = useState(); // state for ads data
  const [endpoint, setEndpoint] = useState(""); // endpoint for searching

  useEffect(() => {
    setAds();
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/ad/ads/${endpoint}`); // get ads from server
        const data = await response.json();
        setAds(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [updated]);

  const renderAds = ({ item }) => <AdCard ad={item} navigation={navigation} />; //render ad function for flatlist

  const Screen = () => (
    <View style={{flex: 1}}>
      {ads ? ( // ternary operator to set loading circle while loading
        <View style={{ flex: 1, gap: 20 }} /* main view once ads are loaded */ >
          <FlatList
            keyExtractor={(item) => item._id}
            ListHeaderComponent={<SearchBar setEndpoint={setEndpoint} />} // SearchBar as header
            data={ads}
            renderItem={renderAds}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginHorizontal: 20,
            }}
          />
          <Button
            onPress={() => {
              if (user) navigation.navigate("CreateAd"); // if user is logged in, move to create ad page
              else navigation.navigate("Login"); // if no user, redirect to Login page
            }}
            color={theme}
            title="Post ad"
          />
        </View>
      ) : (
        <View style={{flex: 1}} /* circle snail while loading */ >
            <Progress.CircleSnail color={theme} size={50}
            style={{alignSelf: 'center', marginTop: 100, fill: 'transparent'}}/>
        </View>
      )}
    </View>
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }} // header not shown on home screen
        name="HomeScreen"
        component={Screen}
      />
      <Stack.Screen options={{ title: "Back" }} name="Ad" component={Ad} />
      <Stack.Screen
        initialParams={{ ad: null }} // pass ad as null
        options={{ title: "Back" }}
        name="CreateAd"
        component={CreateAd}
      />
    </Stack.Navigator>
  );
}

export default Home;
