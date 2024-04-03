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
  const { id } = route.params;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getAdId = async () => {
      if (id) {
        const res = await fetch(`${API}/ad/createAd/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer: ${user.token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(data.error);
        } else {
          setTitle(data.title);
          setLocation(data.location);
          setPhotos(data.photos);
          setDescription(data.description);
          setPrice(data.price);
        }
      } else {
        setTitle("");
        setLocation("");
        setPhotos([]);
        setDescription("");
        setPrice("");
      }
    };

    getAdId();
  }, []);

  const uploadPhoto = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();

      let files = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!files.canceled) {
        const filelist = new FormData();
        for (let i = 0; i < files.assets.length; i++) {
          filelist.append("photos", {
            name: files.assets[i].uri,
            uri: files.assets[i].uri,
            type: "image/jpg",
          });
        }

        const res = await fetch(`${API}/ad/upload`, {
          method: "POST",
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer: ${user.token}`,
          },
          body: filelist,
        });

        const data = await res.json();

        setPhotos((prev) => [...prev, ...data]);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const createAd = async () => {
    const ad = {
      title,
      location,
      photos,
      description,
      price,
    };

    let res;

    if (id) {
      // if updating an existing ad
      res = await fetch(`${API}/ad/createAd/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer: ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...ad }),
      });
    } else {
      // if posting a new ad
      res = await fetch(`${API}/ad/createAd`, {
        method: "POST",
        headers: {
          Authorization: `Bearer: ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ad),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      console.log("res not ok: " + data.error);
      setError(data.error);
      Keyboard.dismiss(); // closes keyboard
    } else {
      navigation.goBack();
      ToastAndroid.show("Ad uploaded", ToastAndroid.LONG);
      setUpdated((prev) => !prev);
    }
  };

  const deletePhoto = (link) => {
    // removes the pic
    setPhotos((prev) => prev.filter((photo) => photo !== link));
  };

  const selectMainPic = (link) => {
    // puts the selected pic as the first in the array
    setPhotos([link, ...photos.filter((photo) => photo !== link)]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, gap: 10, marginBottom: 10 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={(t) => setTitle(t)}
          >
            {title}
          </TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            onChangeText={(t) => setLocation(t)}
          >
            {location}
          </TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Description</Text>
          <TextInput
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
          <TextInput
            style={styles.input}
            placeholder="Price"
            onChangeText={(t) => setPrice(t)}
          >
            {price}
          </TextInput>
        </View>
        <View style={[styles.inputContainer, { width: "30%" }]}>
          <Text style={styles.inputTitle}>Pictures</Text>
          <Button color={theme} title="Upload" onPress={() => uploadPhoto()} />
        </View>
        <View style={styles.imagesContainer}>
          {photos.length > 0 &&
            photos.map((item, index) => {
              return (
                <Pressable
                  key={item+index}
                  onPress={() => selectMainPic(item)}
                  onLongPress={() => {
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
                        borderWidth: index === 0 ? 5 : 0,
                      },
                    ]}
                    src={`${IMG}/${item}`}
                  />
                </Pressable>
              );
            })}
        </View>
        {error && (
          <View style={styles.error}>
            <Text>{error}</Text>
          </View>
        )}
      </ScrollView>
      <Button color={theme} title="Save ad" onPress={() => createAd()} />
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
