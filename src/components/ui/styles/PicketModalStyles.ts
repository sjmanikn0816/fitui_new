import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  backdrop: {
    flex: 1,
  },

  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 28,
  },

  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },

  option: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },

  optionSubtext: {
    fontSize: 12,
    color: "#999999",
  },

  cancelButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
});
