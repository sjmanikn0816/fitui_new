import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
  viewAll: { color: "#10B981", fontWeight: "600" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    elevation: 1,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heartIcon: { fontSize: 32 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  cardDesc: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  logButton: { backgroundColor: "#10B981", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  logButtonText: { color: "#FFF", fontWeight: "600" },
  
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
  
  // Metrics grid layout
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  
  // Individual metric card
  metricCard: {
    width: (width - 52) / 2,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  // Metric card header
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  metricIcon: {
    fontSize: 20,
  },
  metricFreshnessIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  
  // Metric content
  metricContent: {
    alignItems: "center",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 12,
    color: "#6B7280",
  },
  
  // Progress indicators
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
  
  // Error state
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 8,
  },
  errorDesc: {
    fontSize: 14,
    color: "#7F1D1D",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  
  // Summary section
  summaryContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 8,
  },
  refreshingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refreshingText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "500",
  },
});