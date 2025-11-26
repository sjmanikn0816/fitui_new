import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  row: { flexDirection: "row", alignItems: "flex-start" },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  textBox: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  cardDesc: { fontSize: 13, color: "#6B7280" },
});