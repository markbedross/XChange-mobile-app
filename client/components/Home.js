import React, { useContext, useEffect, useState } from "react";
import { Button, View, FlatList, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainContext } from "../contexts/MainContext";
import AdCard from "./AdCard";
import Ad from "./Ad";
import CreateAd from "./CreateAd";
import SearchBar from "./SearchBar";
import * as Progress from 'react-native-progress'

function Home({ navigation }) {
  const Stack = createNativeStackNavigator();

  const { API, user, theme, updated } = useContext(MainContext);
  const [ads, setAds] = useState();
  const [endpoint, setEndpoint] = useState("");

  useEffect(() => {
    setAds();
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/ad/ads/${endpoint}`);
        const data = await response.json();
        setAds(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [updated]);

  const renderAds = ({ item }) => <AdCard ad={item} navigation={navigation} />;

  const Screen = () => (
    <View style={{flex: 1}}>
      {ads ? (
        <View style={{ flex: 1, gap: 20 }}>
          <FlatList
            keyExtractor={(item) => item._id}
            ListHeaderComponent={<SearchBar setEndpoint={setEndpoint} />}
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
              if (user) navigation.navigate("CreateAd");
              else navigation.navigate("Login");
            }}
            color={theme}
            title="Post ad"
          />
        </View>
      ) : (
        <View style={{flex: 1}}>
            <Progress.CircleSnail color={theme} size={50}
            style={{alignSelf: 'center', marginTop: 100, fill: 'transparent'}}/>
        </View>
      )}
    </View>
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="HomeScreen"
        component={Screen}
      />
      <Stack.Screen options={{ title: "Back" }} name="Ad" component={Ad} />
      <Stack.Screen
        initialParams={{ id: null }}
        options={{ title: "Back" }}
        name="CreateAd"
        component={CreateAd}
      />
    </Stack.Navigator>
  );
}

export default Home;
