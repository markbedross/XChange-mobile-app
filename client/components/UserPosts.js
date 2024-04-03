import { StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AdCard from "./AdCard";
import { FlatList } from "react-native-gesture-handler";

function UserPosts({ navigation, userAds }) { // component for Profile page which contains ad list and header

  const renderAds = ({ item }) => ( // render ads function for flatlist, includes userAd set to true
    <AdCard userAd ad={item} navigation={navigation} />
  );

  return (
    <View style={{ flex: 1, marginBottom: 20 }}>
      <FlatList
        ListHeaderComponent={ // header component for flatlist
          <View style={styles.header}>
            <Text style={styles.text} /* Header title */>Your posts</Text>
            <FontAwesome // profile avator
              onPress={() => navigation.navigate("NameAndEmail")} // navigate when clicked
              name="user-circle-o"
              size={24}
              color="black"
            />
          </View>
        }
        keyExtractor={(item) => item._id}
        data={userAds}
        renderItem={renderAds}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      />
    </View>
  );
}

export default UserPosts;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "55%",
    marginLeft: "auto",
    marginRight: 20,
    marginTop: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
