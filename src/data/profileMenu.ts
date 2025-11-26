import { MenuItem } from "@/types/menu";

export const getAccountOptions = (
  handleNavigate: (screen: string, fallbackMsg: string) => void
): MenuItem[] => [
  {
    id: "edit-profile",
    icon: "person",
    title: "Edit Profile",
    hasArrow: true,
    onPress: () =>
      handleNavigate("EditProfile", "Would navigate to Edit Profile screen"),
  },
  {
    id: "privacy-security",
    icon: "security",
    title: "Privacy & Security",
    hasArrow: true,
    onPress: () =>
        handleNavigate("PrivacySecurity", "Would navigate to Edit Profile screen"),
  },
  {
    id: "notifications",
    icon: "notifications",
    title: "Notifications",
    hasArrow: true,
    onPress: () =>
      handleNavigate("Notifications", "Would navigate to Notifications screen"),
  },
];

export const getSupportOptions = (
  handleNavigate: (screen: string, fallbackMsg: string) => void
): MenuItem[] => [
  {
    id: "help-center",
    icon: "help",
    title: "Help Center",
    hasArrow: true,
    onPress: () =>
      handleNavigate("HelpCenter", "Would navigate to Help Center screen"),
  },
  {
    id: "app-settings",
    icon: "settings",
    title: "App Settings",
    hasArrow: true,
    onPress: () =>
      handleNavigate("AppSettings", "Would navigate to App Settings screen"),
  },

  {
    id: "privacy-policy",
  icon: "lock-outline",
    title: "Privacy Policy",
    hasArrow: true,
    onPress: () =>
      handleNavigate("PrivacyPolicy", "Would open Privacy Policy page"),
  },
  {
    id: "terms-conditions",
 icon: "description",
    title: "Terms & Conditions",
    hasArrow: true,
    onPress: () =>
      handleNavigate("TermsConditions", "Would open Terms & Conditions page"),
  },
];
