import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
  mealItem: {
    backgroundColor: Colors.bgCard,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  mealItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealImage: {
    width: width > 400 ? 60 : 50,
    height: width > 400 ? 60 : 50,
    borderRadius: width > 400 ? 30 : 25,
    marginRight: 15,
    borderWidth: 3,
  },
  mealDetails: {
    flex: 1,
  },
  mealTitle: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  mealSubtitle: {
    fontSize: width > 400 ? 14 : 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  mealTime: {
    fontSize: width > 400 ? 12 : 10,
    color: Colors.emerald,
  },
  mealCalories: {
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  caloriesLabel: {
    fontSize: width > 400 ? 12 : 10,
    color: Colors.textSecondary,
  },
});