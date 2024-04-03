import React, { useContext, useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MainContext } from "../contexts/MainContext";

function SearchBar({ setEndpoint }) {

    const {theme, setUpdated} = useContext(MainContext)
    const [text, setText] = useState("")

  return (
    <View style={styles.textbox}>
        <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{alignSelf: 'center'}}>
            {/* maginfying glass icon */}
            <MaterialIcons name="search" color={"black"} size={25} />
        </View>
            {/* text field */}
            <TextInput
            placeholder="Search"
            style={styles.text}
            onChangeText={(text) =>setText(text)}
        />
        </View>
        <View>
            <Button color={theme} title="Search" onPress={()=>{
              setEndpoint(text)
              setUpdated(prev=>!prev)
              }} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textbox: {
    marginHorizontal: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00000030", // black border with 30% opacity
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  text: {
    paddingLeft: 5,
    paddingVertical: 10,
    flex: 1
  },
});

export default SearchBar;
