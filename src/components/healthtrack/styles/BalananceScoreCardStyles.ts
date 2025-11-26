import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    margin: 20,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center" },
  left: { alignItems: "center", marginRight: 20 },
  scoreNumber: { fontSize: 32, fontWeight: "bold", color: "#10B981" },
  scoreLabel: { fontSize: 14, color: "#6B7280" },
  right: { flex: 1 },
  status: { fontSize: 16, fontWeight: "bold", color: "#10B981" },
  description: { fontSize: 13, color: "#6B7280", marginBottom: 12 },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: 8, backgroundColor: "#10B981" },
});