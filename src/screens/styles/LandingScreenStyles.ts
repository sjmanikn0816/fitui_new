import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { scale, verticalScale } from "@/utils/responsive";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    resizeMode: "cover",
    opacity: 0.9,
  },
  mainContent: {
    flex: 1,
    marginTop: "20%",
  },
  topSection: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(30),
    alignItems: "center",
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    backgroundColor: Colors.gray,
    borderRadius: scale(8),
    padding: scale(6),
    alignItems: "center",
    justifyContent: "center",
  },

  speechBubbleContainer: {
    alignItems: "center",
    width: "100%",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(18),
    gap: scale(14),
  },
  profileImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    borderWidth: 2,
    borderColor: Colors.white,
  },

  greetingTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.black,
    fontWeight: "800",
    marginBottom: verticalScale(2),
    flexWrap: "wrap",
  },
  subGreeting: {
    ...Typography.h3,
    fontWeight: "600",
    color: Colors.black,
    flexWrap: "wrap",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white, // solid white input
    borderRadius: scale(30),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(3),
    marginBottom: verticalScale(15),
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.black,
    fontWeight: "800",
    paddingVertical: verticalScale(4),
  },
  addButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(8),
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12),
  },
  yellowBtn: {
    flex: 1,
    backgroundColor: "#FFFFC5",
    paddingVertical: verticalScale(7),
    borderRadius: scale(30),
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  yellowBtnText: {
    ...Typography.bodyMedium,
    color: Colors.gray500,
    fontWeight: 800,
  },
  blackDivider: {
    width: "90%",
    height: 1.5,
    backgroundColor: Colors.black,
    alignSelf: "center",
    marginVertical: verticalScale(12),
    opacity: 1,
  },
  messageContainer: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 20,
  paddingHorizontal: 16,
},

processingTextTitle: {
  color: Colors.info,
  fontSize: 18,
  fontWeight: "700",
  marginTop: 8,
  textAlign: "center",
},

processingTextDesc: {
  color: Colors.white,
  fontSize: 14,
  textAlign: "center",
  marginTop: 8,
  lineHeight: 20,
  opacity: 0.9,
},
});
