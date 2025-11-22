import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
  quickActionButton: {
    width: (width - 60) / 2,
    padding: width > 400 ? 20 : 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    fontSize: width > 400 ? 30 : 25,
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: width > 400 ? 14 : 12,
    opacity: 0.8,
    textAlign: 'center',
  },
});