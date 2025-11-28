// styles/MomItScreenStyles.ts
import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.emerald,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  // Consultation Type Cards
  consultationTypeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  consultationTypeCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  consultationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: Colors.bgCardHover,
  },
  consultationTypeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },
  consultationTypePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.emerald,
  },

  // Doctor Cards
  doctorCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doctorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  doctorContent: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  doctorExperience: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  doctorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  availabilityText: {
    fontSize: 12,
    color: Colors.emerald,
    fontWeight: "500",
    marginLeft: 4,
  },
  sessionPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  // Time Slots
  timeSlotGrid: {
    gap: 12,
  },
  timeSlotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  timeSlotButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },

  // Question Section
  questionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  textArea: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    minHeight: 80,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  bookButton: {
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.emerald,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonIcon: {
    marginRight: 8,
  },
  bookButtonText: {
    color: Colors.bgPrimary,
    fontSize: 18,
    fontWeight: "600",
  },

  // Empty State
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});

export default styles;
