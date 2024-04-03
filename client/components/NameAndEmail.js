import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { MainContext } from "../contexts/MainContext";
import { TextInput } from "react-native-gesture-handler";

function NameAndEmail() {

  // import from context
  const { setUser, theme, user, API } = useContext(MainContext);

  // modal booleans
  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  // fields for modals
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const closeModal = () => {
    // function for closing any modal. sets all modals to false and resets all field values
    setEmailModal(false);
    setPasswordModal(false);
    setEmail("");
    setCurrentPassword("");
    setNewPassword("");
    setError("");
  };

  const changeEmail = async () => {
    // function to change email

    setError("");

    try {
      if (email === user.email) { // checking if user tries to change to the same email
        setError("Please enter a different email");
        throw Error();
      }

      const res = await fetch(`${API}/user/changeEmail`, { // patch email to server
        method: "PATCH",
        headers: {
          Authorization: `Bearer: ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        setError(data.error);
      } else {
        await AsyncStorage.setItem("user", JSON.stringify(data)); // if successful, change storage to reflect new user
        setUser(data);
        closeModal();
        ToastAndroid.show("Email updated successfuly", ToastAndroid.SHORT); // toast to confirm change
      }
    } catch (err) {
      console.log(err.error);
    }
  };

  const changePassword = async () => {
    setError("");

    try {
      const res = await fetch(`${API}/user/changePassword`, { // patch new password to server
        method: "PATCH",
        headers: {
          Authorization: `Bearer: ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        setError(data.error);
      } else {
        closeModal(); // if res ok, just close modal and toast to confirm change
        ToastAndroid.show("Password updated successfuly", ToastAndroid.SHORT);
      }
    } catch (err) {
      console.log(err.error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.modalBackground,
          {
            backgroundColor:
              emailModal || passwordModal ? "#5a5a5a80" : "transparent", // if either modal is active, dims background screen
          },
        ]}
      ></View>
      <View style={styles.card}>
        <View style={{ alignSelf: "center" }} /* View for text and buttons */>
          <Text style={styles.name}>Name: {user.name}</Text>
          <Text style={styles.email}>Email: {user.email}</Text>
          <View style={{ gap: 10 }}>
            <Button
              color={theme}
              title="Change email"
              onPress={() => setEmailModal(true)}
            />
            <Button
              color={theme}
              title="Change password"
              onPress={() => setPasswordModal(true)}
            />
          </View>
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={emailModal} /* email modal */>
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            placeholder="New email"
            onChangeText={(t) => setEmail(t)}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button title="close" onPress={() => closeModal()} />
            <Button title="Change email" onPress={() => changeEmail()} />
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={passwordModal} /* password modal */>
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Current password"
            onChangeText={(t) => setCurrentPassword(t)}
          />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="New password"
            onChangeText={(t) => setNewPassword(t)}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button title="close" onPress={() => closeModal()} />
            <Button title="Change password" onPress={() => changePassword()} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default NameAndEmail;

const styles = StyleSheet.create({
  card: {
    width: "70%",
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: 0,
    justifyContent: "center",
    marginTop: 40,
  },
  name: {
    fontSize: 18,
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
  },
  modal: {
    minHeight: 100,
    width: "80%",
    borderRadius: 10,
    padding: 5,
    alignSelf: "center",
    justifyContent: "space-between",
    marginTop: 210,
    backgroundColor: "lightgrey",
    gap: 5,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 5,
    paddingLeft: 10,
  },
  error: {
    paddingVertical: 10,
    backgroundColor: "pink",
    borderRadius: 10,
    marginVertical: 10,
    width: "50%",
    alignSelf: "center",
    textAlign: "center",
  },
  modalBackground: {
    width: "100%",
    height: "150%",
    position: "absolute",
  },
});
