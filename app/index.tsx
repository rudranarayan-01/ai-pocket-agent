import Colors from "@/shred/Colors";
import { Dimensions, Image, Platform, Text, TouchableOpacity, View } from "react-native";

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
          color: Colors.PRIMARY,
        }}>Welcome to AI Pocket Agent!</Text>
        <Text style={{
          fontSize: 20,
          fontWeight: "500",
          textAlign: "center",
          marginTop: 10,
          color: Colors.GRAY,
        }}>Your personal AI assistant on the go. Try it today. Completely free.</Text>
      </View>

      <TouchableOpacity style={{width:"100%", marginTop:16, padding:15, backgroundColor:Colors.PRIMARY, borderRadius:12, justifyContent:"center", alignItems:"center"}}>
        <Text style={{color:Colors.WHITE, fontSize:24, textAlign:"center"}}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}
