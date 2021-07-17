import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoggedInTabStack from "./components/LoggedInTabStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignInSignUpScreen from "./screens/SignInSignUpScreen";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import store from "./redux/configureStore";

const Stack = createStackNavigator();

function App() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const token = useSelector((state) => state.auth.token);

  // async function loadToken() {
  //   const token = await AsyncStorage.getItem("token");
  //   if (token) {
  //     setSignedIn(true);
  //   }
  //   setLoading(false);
  // }

  // useEffect(() => {
  //   loadToken();
  // }, []);

  // return loading ? (
  //   <View style={styles.container}>
  //     <ActivityIndicator />
  //   </View>
  // ) : (
  return (
    <NavigationContainer>
      <Stack.Navigator
        mode="modal"
        headerMode="none"
        initialRouteName={token != null ? "Logged In" : "SignInSignUp"}
        animationEnabled={false}
      >
        <Stack.Screen component={LoggedInTabStack} name="Logged In" />
        <Stack.Screen component={SignInSignUpScreen} name="SignInSignUp" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
