import { Stack } from "expo-router"
import {} from 'react-native'
export default function CallsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
    </Stack>
  )
}