import { Dimensions, Image, Platform, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop:Platform.OS === 'android' ? 30 : 40,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source = {require('../assets/images/login.png')} 
      style = {{width: Dimensions.get('screen').width * 0.90, height:480, resizeMode:"contain"}}/>
      <View>
        <Text style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 10,
        }}>Welcome to AI Pocket Agent!</Text>
      </View>
    </View>
  );
}
