import { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { MainContext } from "../contexts/MainContext";

function Ad({ route }) {
  const { IMG } = useContext(MainContext); // import setScreen function and IMG const

  const { ad } = route.params; //destructure ad from params

  const [currentPic, setCurrentPic] = useState(ad.photos[0]); // variable for choosing to make an image be the main one
  const hasImage = ad.photos.length > 0; // shorthand for boolean check

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* main image */}
      <Image
        src={hasImage ? `${IMG}/${currentPic}` : `${IMG}/no-image.jpg`}
        style={styles.image}
      />
      <View style={styles.extraImagesContainer}>
        {ad.photos.length > 1 && // displays extra images underneath main image
          ad.photos.map((item) => {
            if (item !== currentPic)
              return (
                // pressing sets the pressed image to be the main image for better viewing
                <Pressable key={item} onPress={() => setCurrentPic(item)}>
                  <Image
                    style={[styles.extraImages, { height: 80, width: 80 }]}
                    src={`${IMG}/${item}`}
                  />
                </Pressable>
              );
          })}
      </View>
      <View style={styles.titlePrice}>
        {/* title and price text boxes */}
        <Text style={styles.title}>{ad.title}</Text>
        <Text style={styles.price}>${ad.price}</Text>
        <Text style={{ marginTop: 10, fontSize: 16 }}>{ad.location}</Text>

        {ad.description && ( // displays description header only if desc exists
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Description:
            </Text>
            <Text style={styles.description}>{ad.description}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1, // keeps image as square
    borderRadius: 10,
    marginTop: 10,
  },
  extraImagesContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
    flexWrap: "wrap",
  },
  extraImages: {
    borderRadius: 10,
    opacity: 0.7,
    backgroundColor: "grey",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    width: "90%",
  },
  titlePrice: {
    alignSelf: "flex-start",
  },
  price: {
    fontSize: 20,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    fontSize: 16,
  },
});

export default Ad;
