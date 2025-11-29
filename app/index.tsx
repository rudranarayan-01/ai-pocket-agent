import { Button, Image, Platform, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop:Platform.OS === 'android' ? 30 : 40
      }}
    >
      <Image source = {require('../assets/images/login.png')} 
      style = {{width: '100%', height: 300, resizeMode: 'contain', marginBottom: 20}}/>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>Welcome to AI Pocket Agent</Text>
      <Text style={{fontSize: 16, color: '#555', marginBottom: 20}}>
        Your personal AI assistant on the go. Get started by logging in or signing up.
      </Text>
      <Button title="Log In" onPress={() => { /* Handle login navigation */ }} />
      <View style={{height: 10}} />
      <Button title="Sign Up" onPress={() => { /* Handle signup navigation */ }} />
    </View>
  );
}
