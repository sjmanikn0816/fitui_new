import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const menuStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderBottomWidth: 0,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
  },
  sheetHeader: {
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: Colors.textMuted,
    borderRadius: 3,
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  list: {
    padding: 20,
  },
  item: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  activeItem: {
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    borderColor: Colors.emerald,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  activeTitle: {
    color: Colors.emerald,
  },
  itemDesc: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
