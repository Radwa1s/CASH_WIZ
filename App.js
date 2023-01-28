import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import "expo-dev-client";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import React, { useState, useEffect } from "react";
import Header from "./header";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  GoogleSignin.configure({
    webClientId:
      "539662080109-dm7gilmgd2p4d6ia28rkinhn61eu98bp.apps.googleusercontent.com",
  });
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const onGoogleButtonPress = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential

    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };

  if (initializing) return null;
  if (!user) {
    return (
      <View style={styles.container}>
        <Header />
        <GoogleSigninButton
          style={{ width: 300, height: 65, marginTop: 300 }}
          onPress={onGoogleButtonPress}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header />
      <View style={{ marginTop: 100, alignItems: "center" }}>
        <Text style={styles.text}>welcome , {user.displayName}</Text>
        <Image
          source={{ uri: user.photoURL }}
          style={{ width: 100, height: 100, borderRadius: 50, margin: 50 }}
        />
        <Button title="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 23,
    fontWeight: "bold",
  },
});
