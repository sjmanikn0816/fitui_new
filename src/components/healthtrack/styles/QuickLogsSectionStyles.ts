import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
const { width } = Dimensions.get("window");
export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
  
  // Title container with status indicator
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  
  // Button container and action buttons
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#10B981",
  },
  syncButton: {
    backgroundColor: "#3B82F6",
  },
  refreshButtonText: {
    fontSize: 16,
    color: "#FFF",
  },
  syncButtonText: {
    fontSize: 16,
    color: "#FFF",
  },
  
  // Legacy styles
  logButton: { backgroundColor: "#10B981", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  logButtonText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  item: {
    width: (width - 52) / 2,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  // Icon box with freshness indicator
  iconBox: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 12,
    position: "relative",
  },
  emoji: { fontSize: 28 },
  freshnessIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  
  // Value display
  valueContainer: {
    alignItems: "center",
    minHeight: 40,
    justifyContent: "center",
  },
  itemTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4, textAlign: "center" },
  itemValue: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#1F2937",
    marginBottom: 2,
  },
  itemSubtitle: { fontSize: 12, color: "#6B7280", textAlign: "center" },
  
  // Error handling
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Info container
  infoContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  infoText: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
  },
});