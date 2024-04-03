import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { MainContext } from "../contexts/MainContext";
import * as ImagePicker from "expo-image-picker";

function CreateAd({ route, navigation }) {

  const { API, user, theme, setUpdated, IMG } = useContext(MainContext);
  const { ad } = route.params; // if making a new ad, this will be null

  // fields for the ad
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  // error state
  const [error, setError] = useState("");

  useEffect(() => {
    if (ad) { // if ad is not null, fill the fields
      setTitle(ad.title);
      setLocation(ad.location);
      setPhotos(ad.photos);
      setDescription(ad.description);
      setPrice(ad.price);
    }
  }, []);

  const uploadPhoto = async () => { // function to upload images to database
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync(); // gets permissions

      let files = await ImagePicker.launchImageLibraryAsync({ // opens gallery
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!files.canceled) { // if user hasn't cancelled
        const filelist = new FormData();

        for (let i = 0; i < files.assets.length; i++) { // for each photo user uploaded, add to filelist
          filelist.append("photos", {
            name: files.assets[i].uri,
            uri: files.assets[i].uri,
            type: "image/jpg",
          });
        }

        const res = await fetch(`${API}/ad/upload`, { // post photos to api
          method: "POST",
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer: ${user.token}`,
          },
          body: filelist,
        });

        const data = await res.json();

        setPhotos((prev) => [...prev, ...data]); // update photos state
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const saveAd = async () => { // function to post the ad

    const adData = { // object for ad data to be sent to server
      title,
      location,
      photos,
      description,
      price,
    };

    let res; // declare response object so if or else can set it

    if (ad) { // if updating an existing ad

      const id = ad._id // need to store id into own variable because can't use dot notation in stringify

      res = await fetch(`${API}/ad/createAd/${id}`, { // put request to server
        method: "PUT",
        headers: {
          Authorization: `Bearer: ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...adData }),
      });
    } else { // if posting a new ad
      res = await fetch(`${API}/ad/createAd`, { // post new ad to server
        method: "POST",
        headers: {
          Authorization: `Bearer: ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      console.log("res not ok: " + data.error);
      setError(data.error);
      Keyboard.dismiss(); // closes keyboard
    } else {
      navigation.goBack();
      ToastAndroid.show("Ad saved", ToastAndroid.LONG);
      setUpdated((prev) => !prev); // change update to update Home and Profile screen to reflect ad change
    }
  };

  const deletePhoto = (link) => { // function to delete a picture
    // removes the pic
    setPhotos((prev) => prev.filter((photo) => photo !== link));
  };

  const selectMainPic = (link) => { // function to select the Thumbnail pic
    // puts the selected pic as the first in the array
    setPhotos([link, ...photos.filter((photo) => photo !== link)]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Title</Text>
          <TextInput // title text input
            style={styles.input}
            placeholder="Title"
            onChangeText={(t) => setTitle(t)}
          >
            {title}
          </TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Location</Text>
          <TextInput // location text input
            style={styles.input}
            placeholder="Location"
            onChangeText={(t) => setLocation(t)}
          >
            {location}
          </TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Description</Text>
          <TextInput // description text input
            style={[styles.input, { textAlignVertical: "top" }]}
            multiline={true}
            numberOfLines={6}
            placeholder="Description"
            onChangeText={(t) => setDescription(t)}
          >
            {description}
          </TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Price</Text>
          <TextInput // price text input
            style={styles.input}
            placeholder="Price"
            onChangeText={(t) => setPrice(t)}
          >
            {price}
          </TextInput>
        </View>
        <View style={[styles.inputContainer, { width: "30%" }]}>
          {/* Label and button for uploading images */}
          <Text style={styles.inputTitle}>Pictures</Text>
          <Button color={theme} title="Upload" onPress={() => uploadPhoto()} />
        </View>
        <View style={styles.imagesContainer}>
          {photos.length > 0 && // once images exist, loop through and display them
            photos.map((item, index) => {
              return (
                <Pressable
                  key={item+index}
                  onPress={() => selectMainPic(item)} // press to set as Main pic
                  onLongPress={() => { // long press to remove the image
                    Alert.alert(
                      "Attention",
                      "Would you like to remove this image?",
                      [
                        { text: "No", onPress: () => {} },
                        { text: "Yes", onPress: () => deletePhoto(item) },
                      ]
                    );
                  }}
                >
                  <Image
                    style={[
                      styles.images,
                      {
                        borderColor: "yellow",
                        borderWidth: index === 0 ? 5 : 0, // only the Main image will have border
                      },
                    ]}
                    src={`${IMG}/${item}`}
                  />
                </Pressable>
              );
            })}
        </View>
        {error && ( // error box
          <View style={styles.error}>
            <Text>{error}</Text>
          </View>
        )}
      </ScrollView>
      <Button color={theme} title="Save ad" onPress={() => saveAd()} />
    </View>
  );
}

export default CreateAd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  inputContainer: {
    gap: 5,
    marginBottom: 14
  },
  inputTitle: {
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    backgroundColor: "white",
  },
  error: {
    backgroundColor: "pink",
    padding: 10,
    marginVertical: 20,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  images: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
