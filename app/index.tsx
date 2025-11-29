import Colors from "@/shred/Colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect } from "react";
import { Dimensions, Image, Platform, Text, TouchableOpacity, View } from "react-native";

// Clerk expo oAuth browser warm up
import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()


export default function Index() {

  const { isSignedIn } = useAuth()
  const router = useRouter();
  const {user} = useUser();

  console.log("User Email:", user?.primaryEmailAddress?.emailAddress);

  useEffect (() => {
    if (isSignedIn) {
      console.log("User is signed in")
    } else {
      console.log("User is NOT signed in")
    }
  }, [isSignedIn]);


  ///////////////// This code from Clerk OAuth Expo example ////////////////////////
  useWarmUpBrowser()

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()

  const onLoginPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      })
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              // router.push('/sign-in/tasks')
              return
            }

            router.push('/')
          },
        })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

////////////////////////////////////////

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

      <TouchableOpacity onPress={onLoginPress} style={{width:"100%", marginTop:16, padding:15, backgroundColor:Colors.PRIMARY, borderRadius:12, justifyContent:"center", alignItems:"center"}}>
        <Text style={{color:Colors.WHITE, fontSize:24, textAlign:"center"}}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}
