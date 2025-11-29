import { Platform, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop:Platform.OS === 'android' ? 30 : 40
      }}
    >
    </View>
  );
}
