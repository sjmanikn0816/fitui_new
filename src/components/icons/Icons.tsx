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
      backgroundColor: focused ? Colors.primary : "#000",
    }}
  >
    <Text
      style={{
        fontSize: size * 0.4,
        fontWeight: "bold",
        color: "#fff",
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
      backgroundColor: focused ? Colors.primary : "#000",
    }}
  >
    <MaterialCommunityIcons
      name="food-apple"
      size={size * 0.6}
      color="#fff"
    />
  </View>
);
