import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');
 export const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 15,
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
  recipeImage: {
    height: width > 400 ? 150 : 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: Colors.bgCardHover,
  },
  recipeContent: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: width > 400 ? 14 : 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeStat: {
    alignItems: 'center',
  },
  recipeStatValue: {
    fontSize: width > 400 ? 14 : 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  recipeStatLabel: {
    fontSize: width > 400 ? 12 : 10,
    color: Colors.textSecondary,
  },
  recipeDifficulty: {
    fontSize: width > 400 ? 12 : 10,
    color: Colors.emerald,
    fontWeight: 'bold',
  },
});
