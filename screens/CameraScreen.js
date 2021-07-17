import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import { lightStyles, darkStyles, commonStyles } from "../styles/commonStyles";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicAction } from "../redux/ducks/accountPref";

export default function CameraScreen({ navigation }) {
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  const [hasPermission, setHasPermission] = useState(null);
  const [back, setBack] = useState(true);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  async function showCamera() {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
    if (hasPermission === false) {
      Alert.alert("Error: No access given");
    }
  }

  function flip() {
    setBack(!back);
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={flip}>
          <FontAwesome
            name="refresh"
            size={24}
            style={{ color: styles.headerTint, marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    showCamera();
  }, []);

  async function takePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    console.log(photo);
    dispatch({ ...dispatch(uploadPicAction()), payload: photo });
    navigation.navigate("Account");
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={additionalStyles.camera}
        type={back ? Camera.Constants.Type.back : Camera.Constants.Type.front}
        ref={cameraRef}
      >
        <View style={additionalStyles.innerView}>
          <View style={additionalStyles.buttonView}>
            <TouchableOpacity
              onPress={() => takePicture()}
              style={additionalStyles.circleButton}
            />
          </View>
        </View>
      </Camera>
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  camera: {
    flex: 1,
  },

  circleButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "white",
  },
  buttonView: {
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
  },
  innerView: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
  },
});
