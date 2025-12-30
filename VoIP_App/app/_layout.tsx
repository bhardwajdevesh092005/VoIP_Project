import { store } from "../store/store";
import { useRouter, Slot, useRootNavigationState, useSegments } from "expo-router";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { View, ActivityIndicator } from "react-native";

function RootNavigator() {
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // 1. Wait for the navigation tree to be fully ready
    setTimeout(()=>
      {
        if (!navigationState?.key) return;

      // segments[0] will return "(auth)" or "(tabs)"
      const inAuthGroup = segments[0] === "(auth)";

      if (isAuthenticated && inAuthGroup) {
        router.replace("/(tabs)");
      } else if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)");
      }
    }, 100);

  }, [isAuthenticated, segments, navigationState?.key, router]);

  if (!navigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}