import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  Switch,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";
import { useSelector, useDispatch } from "react-redux";
import { changeModeAction, deletePicAction } from "../redux/ducks/accountPref";
import { logOutAction } from "../redux/ducks/blogAuth";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  const token = useSelector((state) => state.auth.token);
  const profilePicture = useSelector(
    (state) => state.accountPrefs.profilePicture
  );
  const dispatch = useDispatch();

  async function getUsername() {
    console.log("---- Getting user name ----");
    //const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp");
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }

  function switchMode() {
    dispatch(changeModeAction());
  }

  function deletePic() {
    dispatch(deletePicAction());
  }

  function signOut() {
    dispatch(logOutAction());
    navigation.navigate("SignInSignUp");
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={[styles.title, styles.text, { marginTop: 30 }]}>
        Hello {username} !
      </Text>
      {profilePicture === null ? (
        <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
          <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
            No profile picture. Click to take one.
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <Image
            source={{ uri: profilePicture?.uri }}
            style={{ width: 250, height: 250, borderRadius: 200 }}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
            <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
              Dont like this picture? Click to take one.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deletePic}>
            <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
              Delete picture?
            </Text>
          </TouchableOpacity>
        </>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text style={[styles.content, styles.text]}> Dark Mode? </Text>
        <Switch value={isDark} onChange={switchMode} />
      </View>
      <TouchableOpacity style={[styles.button]} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
