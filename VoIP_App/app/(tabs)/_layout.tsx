import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function TabLayout() {
  const { colorTheme, colorMode } = useSelector((state: RootState) => state.theme);
  const palette = colorTheme[colorMode];
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: palette.border,
        },
      }}
    >
        <Tabs.Screen 
          options={{
            headerShown: false,
            tabBarLabel: "Chats",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles" color={color} size={size} />
            ),
          }} 
          name="index"/>
        <Tabs.Screen
          name="calls"
          options={{
            tabBarLabel: "Calls",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="call" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            tabBarLabel: "Contacts",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />  
    </Tabs>
  );
}
