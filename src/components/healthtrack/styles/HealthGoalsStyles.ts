import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 40 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  card: { backgroundColor: "#FFF", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  goalTitle: { fontSize: 14, fontWeight: "600", flex: 1 },
  progressText: { fontSize: 16, fontWeight: "bold" },
  progressBarBg: { height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, overflow: "hidden" },
  progressBar: { height: 8, borderRadius: 4 },
});