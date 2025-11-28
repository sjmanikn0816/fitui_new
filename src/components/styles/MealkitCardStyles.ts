import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");
export const styles = StyleSheet.create({
  mealKitCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 15,
    width: (width - 60) / 2,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealKitImage: {
    height: width > 400 ? 120 : 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: Colors.bgCardHover,
  },
  mealKitContent: {
    padding: 15,
  },
  mealKitTitle: {
    fontSize: width > 400 ? 14 : 12,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  mealKitSubtitle: {
    fontSize: width > 400 ? 12 : 10,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  mealKitRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  ratingText: {
    color: Colors.bgPrimary,
    fontSize: width > 400 ? 12 : 10,
    fontWeight: "bold",
  },
  betterText: {
    fontSize: width > 400 ? 10 : 8,
    color: Colors.textSecondary,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: width > 400 ? 14 : 12,
    color: Colors.textMuted,
    textDecorationLine: "line-through",
  },
});
