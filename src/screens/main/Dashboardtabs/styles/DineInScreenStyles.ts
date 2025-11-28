import { Colors } from "@/constants/Colors";
import { scale } from "@/utils/responsive";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const scaleFont = (size) => (width / 375) * size;

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },

  section: {
    marginTop: height * 0.03,
    paddingHorizontal: width * 0.05,
  },

  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: Colors.gray700,
    marginBottom: height * 0.02,
  },

  restaurantCard: {
    width: width * 0.7,
    backgroundColor: Colors.white,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: height * 0.02,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  restaurantImage: {
    width: "100%",
    height: width * 0.4,
    backgroundColor: Colors.gray100,
  },

  restaurantContent: {
    padding: width * 0.04,
  },

  restaurantName: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: Colors.gray700,
    marginBottom: height * 0.01,
  },

  badge: {
    backgroundColor: Colors.violet,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginBottom: height * 0.01,
  },

  badgeText: {
    color: Colors.white,
    fontSize: scaleFont(12),
    fontWeight: "600",
  },

  restaurantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: height * 0.005,
  },

  infoText: {
    fontSize: scaleFont(12),
    color: Colors.gray500,
  },

  restaurantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: width * 0.02,
  },

  smallRestaurantCard: {
    width: width * 0.45,
    backgroundColor: Colors.white,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: height * 0.02,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

smallRestaurantImage: {
  width: "100%",
  height: width * 0.3,
  borderRadius:scale(10),             
  overflow: "hidden",            
  backgroundColor: Colors.gray100,
},

  smallRestaurantContent: {
    padding: width * 0.03,
  },

  smallRestaurantName: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: Colors.gray700,
    marginBottom: height * 0.008,
  },

  smallBadge: {
    backgroundColor: Colors.violet,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.003,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: height * 0.008,
  },

  smallBadgeText: {
    color: Colors.white,
    fontSize: scaleFont(10),
    fontWeight: "600",
  },

  smallRestaurantInfo: {
    fontSize: scaleFont(11),
    color: Colors.gray500,
  },

  reservationCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.01,
  },

  reservationRestaurant: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: Colors.gray700,
  },

  statusBadge: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.003,
    borderRadius: 12,
  },

  statusText: {
    color: Colors.white,
    fontSize: scaleFont(12),
    fontWeight: "600",
  },

  reservationDetails: {
    gap: height * 0.005,
  },

  reservationInfo: {
    fontSize: scaleFont(14),
    color: Colors.gray500,
  },

  analyticsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: width * 0.03,
  },

  analyticsCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: width * 0.04,
    flex: 1,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  analyticsNumber: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: Colors.gray700,
    marginBottom: height * 0.005,
  },

  analyticsLabel: {
    fontSize: scaleFont(12),
    color: Colors.gray500,
    textAlign: "center",
  },

  aiCardInside: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: width * 0.03,
    marginTop: height * 0.01,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  dietBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.003,
    marginTop: height * 0.005,
  },

  dietBadgeText: {
    fontSize: scaleFont(12),
    fontWeight: "600",
  },

  aiTitleInside: {
    fontWeight: "bold",
    fontSize: scaleFont(14),
    marginBottom: height * 0.008,
    color: Colors.gray700,
  },

  aiColumn: {
    flexDirection: "column",
    width: "100%",
  },

  aiLine: {
    fontSize: scaleFont(13),
    color: Colors.gray600,
    flexWrap: "wrap",
    marginBottom: height * 0.004,
  },

  aiLabel: {
    fontWeight: "600",
    color: Colors.violet,
    marginRight: width * 0.01,
  },
});
