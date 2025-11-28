import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  clinicalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: width > 400 ? 12 : 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderLeftWidth: 4,
    backgroundColor: Colors.bgCardHover,
    borderRadius: 8,
  },
  clinicalCardMain: {
    backgroundColor: Colors.bgCard,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  clinicalTitle: {
    fontSize: width > 400 ? 12 : 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  clinicalTitleMain: {
    fontSize: width > 400 ? 14 : 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  clinicalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  clinicalValue: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: 'bold',
  },
  clinicalUnit: {
    fontSize: width > 400 ? 12 : 10,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});