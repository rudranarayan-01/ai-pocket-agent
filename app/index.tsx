import Colors from "@/shred/Colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { firestoreDb } from "@/config/firebase";
import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { doc, setDoc } from "firebase/firestore";

// Warm up the browser on Android
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Complete pending auth sessions
WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);

  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)/Home");
    }
    if (isSignedIn !== undefined) {
      setLoading(false);
    }
  }, [isSignedIn]);

  const saveUserToFirestore = async (clerkUser: {
    id: string;
    emailAddress?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }) => {
    const email = clerkUser.emailAddress ?? "";
    if (!email) return;

    await setDoc(
      doc(firestoreDb, "users", email),
      {
        email,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        userId: clerkUser.id,
        joinDate: Date.now(),
        credits: 20,
      },
      { merge: true }
    );
    console.log("User saved to Firestore:", clerkUser.emailAddress);
  };

  const onLoginPress = useCallback(async () => {
    console.log("Login button pressed.");
    try {
      setAuthInProgress(true);
      console.log("Starting SSO Flow...");

      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      console.log("After startSSOFlow");


      console.log("createdSessionId:", createdSessionId);
      console.log("signIn status:", signIn?.status);
      console.log("signUp status:", signUp?.status);

      // Case 1: session already created – sign-in/sign-up complete
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        // use the active user (loaded by Clerk) to sync to Firestore
        if (user) {
          const loggedInEmail =
            user.primaryEmailAddress?.emailAddress ?? ""; // <--- email here
          console.log("Logged-in user email:", loggedInEmail);

          await saveUserToFirestore({
            id: user.id,
            emailAddress: loggedInEmail,
            firstName: user.firstName,
            lastName: user.lastName,
          });
        }

        router.replace("/(tabs)/Home");
        console.log("User signed in successfully.",user?.primaryEmailAddress?.emailAddress);
        return;
      }

      // Case 2: sign-up flow exists but has missing requirements
      if (signUp && signUp.status === "missing_requirements") {
        // Example: automatically set username or other fields if required.
        // Adjust this depending on your Clerk settings.
        const autoUsername =
          signUp.emailAddress?.split("@")[0] ?? `user_${Date.now()}`;

        const completedSignUp = await signUp.update({
          // Add required fields here:
          // username, legalAccepted, etc., according to your instance config.
          username: autoUsername,
        });

        console.log("Updated signUp status:", completedSignUp.status);

        if (completedSignUp.status === "complete") {
          const completedEmail = completedSignUp.emailAddress ?? "";
          console.log("Signed-up user email:", completedEmail); // <--- email here

          // Now Clerk has a user and a session; activate it.
          if (completedSignUp.createdSessionId) {
            await setActive!({ session: completedSignUp.createdSessionId });
          }

          // Save user to Firestore using the sign-up object
          await saveUserToFirestore({
            id: completedSignUp.id,
            emailAddress: completedEmail,
            firstName: completedSignUp.firstName,
            lastName: completedSignUp.lastName,
          });

          router.replace("/(tabs)/Home");
          console.log("User signed up and session created.");
          return;
        }

        console.log(
          "Sign-up still not complete; additional manual steps may be required."
        );
        return;
      }

      // Case 3: sign-in flow with extra requirements (like MFA)
      if (signIn && signIn.status !== "complete") {
        console.log(
          "Sign-in has extra requirements (e.g., MFA) that need custom handling.",
          signIn.status
        );
        // Here you would build a UI to handle MFA or other factors.
        return;
      }

      console.log("Additional steps required for sign-in/sign-up.");
    } catch (err) {
      console.error("OAuth error:", JSON.stringify(err, null, 2));
    } finally {
      setAuthInProgress(false);
    }
  }, [startSSOFlow, router, user]);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: Platform.OS === "android" ? 30 : 40,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/login.png")}
        style={{
          width: Dimensions.get("screen").width * 0.9,
          height: 480,
          resizeMode: "contain",
        }}
      />
      <View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 10,
            color: Colors.PRIMARY,
          }}
        >
          Welcome to AI Pocket Agent!
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            textAlign: "center",
            marginTop: 10,
            color: Colors.GRAY,
          }}
        >
          Your personal AI assistant on the go. Try it today. Completely free.
        </Text>
      </View>

      {!loading && !authInProgress && (
        <TouchableOpacity
          onPress={onLoginPress}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: 24,
              textAlign: "center",
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      )}

      {(loading || authInProgress) && (
        <ActivityIndicator
          size="large"
          color={Colors.PRIMARY}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
}
