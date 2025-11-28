import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

  const getHeaderConfig = (): HeaderConfig & { backIconColor?: string; gradientColors?: string[]; backgroundImage?: string } => {
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
      gradientColors: ["rgba(16, 185, 129, 0.93)", "rgba(5, 150, 105, 0.90)"],
      backgroundImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    };

    switch (activeTab) {
      case "make-it":
        return {
          backgroundColor: "#10B981",
          title: "Make It",
          subtitle: `${userAge}-year-old Health Warrior!`,
          description: "Your personalized nutrition journey continues",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
          gradientColors: ["rgba(16, 185, 129, 0.93)", "rgba(5, 150, 105, 0.90)"],
          backgroundImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
        };
      case "go-shop":
        return {
          backgroundColor: "#F59E0B",
          title: "Go Shop",
          subtitle: "Fresh ingredients await",
          description: "Smart shopping for healthy living",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
          gradientColors: ["rgba(245, 158, 11, 0.93)", "rgba(217, 119, 6, 0.90)"],
          backgroundImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
        };
      case "dine-in":
        return {
          backgroundColor: "#4CAF50",
          title: "Dine-In",
          subtitle: "It's just a drive away",
          description: "Healthy eateries at driving distance",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
          gradientColors: ["rgba(76, 175, 80, 0.93)", "rgba(56, 142, 60, 0.90)"],
          backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
        };
      case "mom-it":
        return {
          backgroundColor: "#8B5CF6",
          title: "Expert Guidance",
          subtitle: "Professional Support",
          description: "Connect with certified nutrition professionals",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
          backIconColor: Colors.white,
          gradientColors: ["rgba(139, 92, 246, 0.93)", "rgba(109, 40, 217, 0.90)"],
          backgroundImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
        };

      default:
        return defaultConfig;
    }
  };

  const headerConfig = getHeaderConfig();

  return (
    <View style={[styles.headerContent, { overflow: "hidden" }]}>
      <StatusBar
        translucent={transparent}
        backgroundColor="transparent"
        barStyle="light-content"
        animated
      />
      <ImageBackground
        source={{ uri: headerConfig.backgroundImage }}
        style={{
          minHeight: compact ? 90 : showTabs ? 200 : 130,
        }}
        imageStyle={styles.headerImageStyle}
      >
        <LinearGradient
          colors={headerConfig.gradientColors || ["rgba(16, 185, 129, 0.93)", "rgba(5, 150, 105, 0.90)"]}
          style={{
            flex: 1,
            paddingTop: Platform.OS === "ios" ? 60 : 50,
            paddingBottom: compact ? 12 : showTabs ? 20 : 16,
            paddingHorizontal: 20,
          }}
        >
          {/* Menu Button */}
          <TouchableOpacity
            style={[
              styles.menuButton,
              {
                position: "absolute",
                right: 16,
                top: Platform.OS === "ios" ? 50 : 60,
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: 8,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.25)",
              },
              extraMenuStyle,
            ]}
            onPress={handleMorePress}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.white} />
          </TouchableOpacity>

          {/* Header Title Section */}
          <View style={styles.headerTextContainer}>
            <View style={styles.headerRow}>
              {showBackIcon && (
                <TouchableOpacity
                  onPress={onBackPress || (() => navigation.goBack())}
                  style={{
                    marginRight: 8,
                    backgroundColor: "rgba(255,255,255,0.15)",
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
                style={[
                  styles.greetingText,
                  {
                    color: headerConfig.titleColor,
                    textShadowColor: "rgba(0, 0, 0, 0.3)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  },
                ]}
                numberOfLines={2}
              >
                {headerConfig.title}
              </Text>
            </View>

            {headerConfig.subtitle ? (
              <Text
                style={[
                  styles.welcomeText,
                  {
                    color: headerConfig.subtitleColor,
                    textShadowColor: "rgba(0, 0, 0, 0.2)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  },
                ]}
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

          {/* Tabs Section */}
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
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default DashboardHeader;
