import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { DashboardHeaderProps, TabId, HeaderConfig } from "@/types";
import { styles } from "./styles/DashboardHeader";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface ExtendedHeaderProps extends DashboardHeaderProps {
  customHeaderConfig?: HeaderConfig & { backIconColor?: string };
  showTabs?: boolean;
  title?: string;
  description?: string;
  backgroundColor?: string;
  subtitle?: string;
  onBackPress?: () => void;
  compact?: boolean;
  onMorePress?: () => void;
  transparent?: boolean;
  showBackIcon?: boolean; // ✅ Added prop
  extraMenuStyle?: object; // ✅ Added prop for Landing screen menu adjustment
}

const DashboardHeader: React.FC<ExtendedHeaderProps> = ({
  activeTab,
  onTabChange,
  userAge = "30",
  customHeaderConfig,
  showTabs = true,
  title,
  description,
  subtitle,
  backgroundColor,
  onBackPress,
  compact = false,
  onMorePress,
  transparent = false,
  showBackIcon = false, 
  extraMenuStyle = {}, 
}) => {
  const navigation = useNavigation<any>();

  const handleMorePress = () => {
    if (onMorePress) {
      onMorePress();
    } else {
      navigation.navigate("AllScreensMenu", { activeTab });
    }
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "make-it", label: "Make It", icon: "restaurant-outline" },
    { id: "go-shop", label: "Go Shop", icon: "cart-outline" },
    { id: "dine-in", label: "Dine-In", icon: "storefront-outline" },
    { id: "mom-it", label: "Mom It", icon: "heart-outline" },
  ];

  const getHeaderConfig = (): HeaderConfig & { backIconColor?: string } => {
    if (customHeaderConfig) return customHeaderConfig;

    const defaultConfig = {
      backgroundColor: backgroundColor || Colors.primary,
      title: title || "",
      subtitle: subtitle || "",
      description: description || "",
      titleColor: Colors.white,
      subtitleColor: Colors.white,
      descriptionColor: Colors.white,
      backIconColor: Colors.white,
    };

    switch (activeTab) {
      case "make-it":
        return {
          backgroundColor: "#56D9E3",
          title: "Make It",
          subtitle: `${userAge}-year-old Health Warrior!`,
          description: "Your personalized nutrition journey continues",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
        };
      case "go-shop":
        return {
          backgroundColor: "#FDA745",
          title: "Go Shop",
          subtitle: "Fresh ingredients await",
          description: "Smart shopping for healthy living",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
        };
      case "dine-in":
        return {
          backgroundColor: "#4CAF50",
          title: "Dine-In",
          subtitle: "It’s just a drive away",
          description: "Healthy eateries at driving distance",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
        };
      case "mom-it":
        return {
          backgroundColor: "#56D9E3",
          title: "Expert Guidance",
          subtitle: "Professional Support",
          description: "Connect with certified nutrition professionals",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
        };
  
      default:
        return defaultConfig;
    }
  };

  const headerConfig = getHeaderConfig();

  return (
    <View
      style={[
        styles.headerContent,
        {
          backgroundColor: transparent
            ? "transparent"
            : headerConfig.backgroundColor,
          minHeight: compact ? 90 : showTabs ? 200 : 130,
          paddingTop: Platform.OS === "ios" ? 60 : 50,
          paddingBottom: compact ? 12 : showTabs ? 20 : 16,
          zIndex: 10,
        },
      ]}
    >
      <StatusBar
        translucent={transparent}
        backgroundColor={
          transparent ? "transparent" : headerConfig.backgroundColor
        }
        barStyle="light-content"
        animated
      />

      {/* ✅ Menu Button */}
      <TouchableOpacity
        style={[
          styles.menuButton,
          {
            position: "absolute",
            right: 16,
            top: Platform.OS === "ios" ? 50 : 60,
            backgroundColor: transparent
              ? "rgba(0,0,0,0.25)"
              : "rgba(255,255,255,0.1)",
            padding: 8,
            borderRadius: 20,
          },
          extraMenuStyle, // ✅ Apply custom style (Landing screen uses this)
        ]}
        onPress={handleMorePress}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-horizontal" size={22} color={Colors.white} />
      </TouchableOpacity>

      {/* ✅ Header Title Section */}
      <View style={styles.headerTextContainer}>
        <View style={styles.headerRow}>
          {showBackIcon && ( // ✅ Toggle dynamically
            <TouchableOpacity
              onPress={onBackPress || (() => navigation.goBack())}
              style={{
                marginRight: 8,
                backgroundColor: transparent
                  ? "rgba(0,0,0,0.25)"
                  : "transparent",
                padding: 6,
                borderRadius: 20,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={headerConfig.backIconColor || Colors.white}
              />
            </TouchableOpacity>
          )}

          <Text
            style={[styles.greetingText, { color: headerConfig.titleColor }]}
            numberOfLines={2}
          >
            {headerConfig.title}
          </Text>
        </View>

        {headerConfig.subtitle ? (
          <Text
            style={[styles.welcomeText, { color: headerConfig.subtitleColor }]}
          >
            {headerConfig.subtitle}
          </Text>
        ) : null}

        {headerConfig.description ? (
          <Text
            style={[
              styles.descriptionText,
              { color: headerConfig.descriptionColor },
            ]}
          >
            {headerConfig.description}
          </Text>
        ) : null}
      </View>

      {/* ✅ Tabs Section */}
      {showTabs && (
        <View style={styles.modernTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollableTabs}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.headerTab, isActive && styles.activeHeaderTab]}
                  onPress={() => onTabChange?.(tab.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.headerTabText,
                      isActive && styles.activeHeaderTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default DashboardHeader;
