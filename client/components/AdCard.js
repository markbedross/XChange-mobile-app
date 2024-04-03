import { useContext } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { MainContext } from "../contexts/MainContext";

function AdCard({ userAd, ad, navigation }) {

  const { API, IMG, user, setUpdated } = useContext(MainContext); // import from context

  const hasPhotos = ad.photos.length > 0; // booldean check to see if ad has photos

  const deleteAlert = () => {
    // alert for deleting the ad from profile
    Alert.alert("Attention", "Would you like to delete this ad?", [
      { text: "No", onPress: () => {} },
      { text: "Yes", onPress: deleteAd },
    ]);
  };

  const deleteAd = async () => { // function to delete an Ad
    fetch(`${API}/ad/delete/${ad._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer: ${user.token}`,
      },
    }).catch((err) => console.log(err));
    setUpdated((prev) => !prev);
  };

  return (
    <TouchableNativeFeedback
      onPress={() => {
        if (userAd) navigation.navigate("UpdateAd", { ad }); // if this is a userAd, go to "UpdateAd" page, and pass ad as param
        else navigation.navigate("Ad", { ad }); // else go to regular Ad page, and pass ad as param
      }}
      onLongPress={() => {
        if (userAd) deleteAlert();
      }} // on long press, opens Alert asking to delete ad, after checking if this is a userAd
    >
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            backgroundColor: "lightgrey",
            borderRadius: 8,
          }} /* lightgrey background used for no image */
        >
          <Image
            source={{
              uri: hasPhotos
                ? `${IMG}/${ad.photos[0]}`
                : `${IMG}/no-image.jpg`, // code for placeholder image
            }}
            style={[styles.image, { opacity: hasPhotos ? 1 : 0.4 }]} // if placeholder, set opacity to 0.4
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }} // Location and price container
        >
          <Text style={styles.location}>{ad.location}</Text>
          <Text style={styles.price}>${ad.price}</Text>
        </View>
        <Text numberOfLines={1} style={styles.title}>
          {ad.title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "45%",
    height: 145,
    borderRadius: 8,
    marginTop: 10,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 100,
    alignSelf: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 5,
  },
  location: {
    marginHorizontal: 5,
    fontSize: 15,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
});

export default AdCard;
