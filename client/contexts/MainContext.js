import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MainContext = createContext();

export function MainContextProvider(props) {

  const API = "http://10.0.2.2:8000"; // API for server
  const IMG = API + "/uploads"; // short hand so I don't have to type API/uploads everywhere
  const theme = "#f5385d"; // color theme for the app
  const [user, setUser] = useState(); // state for currently signed in user
  const [updated, setUpdated] = useState(false); // boolean state to tell certain pages to update on flip

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await AsyncStorage.getItem("user"); // if user exists in storage, retrieves it
        const user = JSON.parse(data);
        setUser(user); // user will be null if no user
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  return (
    <MainContext.Provider
      value={{ // sets which values the provider provides
        API,
        IMG,
        user,
        setUser,
        updated,
        setUpdated,
        theme,
      }}
    >
    {/* renders all the children of the Provider */}
      {props.children}
    </MainContext.Provider>
  );
}
