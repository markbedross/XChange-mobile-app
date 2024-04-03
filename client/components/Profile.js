import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { Button, View } from "react-native";
import { MainContext } from "../contexts/MainContext";
import NameAndEmail from "./NameAndEmail";
import UserPosts from "./UserPosts";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateAd from "./CreateAd";
import * as Progress from "react-native-progress";

function Profile({ navigation }) {

  // import from context
  const { setUser, theme, updated, API, user } = useContext(MainContext);

  // state for user's ads
  const [userAds, setUserAds] = useState();

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    setUserAds();
    const getUserAds = async () => {
      const res = await fetch(`${API}/user/ads`, { // fetch user ads from server
        headers: {
          Authorization: `Bearer: ${user.token}`,
        },
      });
      const data = await res.json();
      setUserAds(data);
    };
    getUserAds();
  }, [updated]);

  const Screen = () => (
    <View style={{ flex: 1 }}>
      {userAds ? ( // ternary operator for circle snail while loading
        <View style={{ flex: 1 }}>
          <UserPosts userAds={userAds} navigation={navigation} />
          <Button
            color={theme}
            title="Logout"
            onPress={() => {
              setUser(null);
              AsyncStorage.removeItem("user");
              navigation.navigate("Home");
            }}
          />
        </View>
      ) : ( // circle snail
        <View style={{ flex: 1 }}>
          <Progress.CircleSnail
            color={theme}
            size={50}
            style={{ alignSelf: "center", marginTop: 100, fill: "transparent" }}
          />
        </View>
      )}
    </View>
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }} // don't show stack header on this screen
        name="ProfileScreen"
        component={Screen}
      />
      <Stack.Screen
        options={{ title: "Back" }}
        name="NameAndEmail"
        component={NameAndEmail}
      />
      <Stack.Screen
        options={{ title: "Back" }}
        name="UpdateAd"
        component={CreateAd}
      />
    </Stack.Navigator>
  );
}

export default Profile;