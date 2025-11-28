import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const KcalIcon = ({
  size,
  color,
  focused,
}: {
  size: number;
  color: string;
  focused: boolean;
}) => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      width: size,
      height: size,
      borderRadius: 8,
      backgroundColor: focused ? "rgba(52, 211, 153, 0.2)" : "rgba(255, 255, 255, 0.08)",
      borderWidth: focused ? 1 : 0,
      borderColor: focused ? Colors.emerald : "transparent",
    }}
  >
    <Text
      style={{
        fontSize: size * 0.35,
        fontWeight: "bold",
        color: focused ? Colors.emerald : Colors.textMuted,
      }}
    >
      kcal
    </Text>
  </View>
);

export const FoodAnalysisIcon = ({
  size,
  color,
  focused,
}: {
  size: number;
  color: string;
  focused: boolean;
}) => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      width: size,
      height: size,
      borderRadius: size * 0.3,
      backgroundColor: focused ? "rgba(52, 211, 153, 0.2)" : "rgba(255, 255, 255, 0.08)",
      borderWidth: focused ? 1 : 0,
      borderColor: focused ? Colors.emerald : "transparent",
    }}
  >
    <MaterialCommunityIcons
      name="food-apple"
      size={size * 0.6}
      color={focused ? Colors.emerald : Colors.textMuted}
    />
  </View>
);
