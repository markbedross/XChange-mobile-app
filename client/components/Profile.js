import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { MainContext } from "../contexts/MainContext";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
import NameAndEmail from "./NameAndEmail";
import OptionsAndPosts from "./OptionsAndPosts";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateAd from "./CreateAd";
import * as Progress from 'react-native-progress'

function Profile({ navigation }) {
  const { setUser, theme, updated, API, user } = useContext(MainContext);

  const [userAds, setUserAds] = useState();

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    setUserAds();
    const getUserAds = async () => {
      const res = await fetch(`${API}/user/ads`, {
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
      {userAds ? (
        <View style={{ flex: 1 }}>
          <OptionsAndPosts userAds={userAds} navigation={navigation} />
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
      ) : (
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
        options={{ headerShown: false }}
        name="ProfileScreen"
        component={Screen}
      />
      <Stack.Screen
        options={{ title: "Back" }}
        name="NameAndEmails"
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

const styles = StyleSheet.create({});
