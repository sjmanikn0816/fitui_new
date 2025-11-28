import { Colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray100 , paddingBottom: verticalScale(60)}, // responsive bottom padding,
  scrollView: { flex: 1 },
  section: { marginTop: 24 },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 12,
    paddingBottom: 4,
  },
  bottomSpacing: { height: 32 },
});
