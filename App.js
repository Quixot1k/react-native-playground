import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "./components/BottomSheet";
import { useRef } from "react";

export default function App() {
  const bottomSheetRef = useRef(null);
  const onPress = () => {
    bottomSheetRef.current?.scrollTo(-150);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <TouchableOpacity style={styles.button} onPress={onPress} />
        <BottomSheet ref={bottomSheetRef}>
          <View style={{ flex: 1, backgroundColor: "#f5f5f5" }} />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: "white",
    opacity: 0.6,
  },
});
