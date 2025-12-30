
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/store/slices/user.slice";
import { RootState } from "../../store/store";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
export default function AuthLayout() {
    const { colorTheme, colorMode } = useSelector((state: RootState) => state.theme);
    const palette = colorTheme[colorMode];
    const dispatch = useDispatch();
    return (
        <View style={[styles.container, { backgroundColor: palette.background }]}> 
            <Animated.View
                entering={FadeInUp.duration(600)}
                style={{ width: '100%', maxWidth: 400 }}
            >
                <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}> 
                    <Text style={[styles.title, { color: palette.primary }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: palette.textSecondary }]}>Sign in to your account</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: palette.secondary, color: palette.text, borderColor: palette.border }]}
                        placeholder="Email"
                        placeholderTextColor={palette.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: palette.secondary, color: palette.text, borderColor: palette.border }]}
                        placeholder="Password"
                        placeholderTextColor={palette.textSecondary}
                        secureTextEntry
                    />
                    <TouchableOpacity style={[styles.button, { backgroundColor: palette.primary }]} onPress={()=>{
                        dispatch(setUser({ isAuthenticated: true }));
                    }}> 
                        <Text style={[styles.buttonText, { color: palette.surface }]}>Login</Text>
                    </TouchableOpacity>
                    <Text style={[styles.or, { color: palette.textSecondary }]}>or</Text>
                    <TouchableOpacity style={[styles.googleButton, { borderColor: palette.border }]}> 
                        <Ionicons name="logo-google" size={20} color={palette.accent} style={{ marginRight: 8 }} />
                        <Text style={[styles.googleText, { color: palette.text }]}>Login with Google</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "100%",
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        width: "100%",
        borderRadius: 8,
        padding: Platform.OS === "web" ? 14 : 12,
        marginBottom: 16,
        borderWidth: 1,
        fontSize: 16,
    },
    button: {
        width: "100%",
        borderRadius: 8,
        padding: 14,
        alignItems: "center",
        marginBottom: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    or: {
        textAlign: "center",
        marginVertical: 8,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    googleText: {
        fontSize: 16,
        fontWeight: "500",
    },
});