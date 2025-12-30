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
                    tabBarLabel: "Login",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="log-in" color={color} size={size} />
                    ),
                }}
                name="index"/>
            <Tabs.Screen
                name="register"
                options={{
                    tabBarLabel: "Register",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-add" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}