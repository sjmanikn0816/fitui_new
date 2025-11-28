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

    // Dark theme gradient colors - consistent across all tabs
    const darkGradient = [Colors.bgPrimary, "rgba(10, 10, 12, 0.95)"];

    const defaultConfig = {
      backgroundColor: backgroundColor || Colors.bgPrimary,
      title: title || "",
      subtitle: subtitle || "",
      description: description || "",
      titleColor: Colors.textPrimary,
      subtitleColor: Colors.emerald,
      descriptionColor: Colors.textSecondary,
      backIconColor: Colors.textPrimary,
      gradientColors: darkGradient,
      backgroundImage: undefined,
    };

    switch (activeTab) {
      case "make-it":
        return {
          backgroundColor: Colors.bgPrimary,
          title: "Make It",
          subtitle: `${userAge}-year-old Health Warrior!`,
          description: "Your personalized nutrition journey continues",
          titleColor: Colors.textPrimary,
          subtitleColor: Colors.emerald,
          descriptionColor: Colors.textSecondary,
          backIconColor: Colors.textPrimary,
          gradientColors: darkGradient,
          backgroundImage: undefined,
        };
      case "go-shop":
        return {
          backgroundColor: Colors.bgPrimary,
          title: "Go Shop",
          subtitle: "Fresh ingredients await",
          description: "Smart shopping for healthy living",
          titleColor: Colors.textPrimary,
          subtitleColor: Colors.emerald,
          descriptionColor: Colors.textSecondary,
          backIconColor: Colors.textPrimary,
          gradientColors: darkGradient,
          backgroundImage: undefined,
        };
      case "dine-in":
        return {
          backgroundColor: Colors.bgPrimary,
          title: "Dine-In",
          subtitle: "It's just a drive away",
          description: "Healthy eateries at driving distance",
          titleColor: Colors.textPrimary,
          subtitleColor: Colors.emerald,
          descriptionColor: Colors.textSecondary,
          backIconColor: Colors.textPrimary,
          gradientColors: darkGradient,
          backgroundImage: undefined,
        };
      case "mom-it":
        return {
          backgroundColor: Colors.bgPrimary,
          title: "Expert Guidance",
          subtitle: "Professional Support",
          description: "Connect with certified nutrition professionals",
          titleColor: Colors.textPrimary,
          subtitleColor: Colors.emerald,
          descriptionColor: Colors.textSecondary,
          backIconColor: Colors.textPrimary,
          gradientColors: darkGradient,
          backgroundImage: undefined,
        };

      default:
        return defaultConfig;
    }
  };

  const headerConfig = getHeaderConfig();

  const renderHeaderContent = () => (
    <LinearGradient
      colors={headerConfig.gradientColors || [Colors.bgPrimary, "rgba(10, 10, 12, 0.95)"]}
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 60 : 50,
        paddingBottom: compact ? 12 : showTabs ? 20 : 16,
        paddingHorizontal: 20,
        minHeight: compact ? 90 : showTabs ? 200 : 130,
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
            backgroundColor: Colors.bgCard,
            padding: 8,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: Colors.borderDark,
          },
          extraMenuStyle,
        ]}
        onPress={handleMorePress}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Header Title Section */}
      <View style={styles.headerTextContainer}>
        <View style={styles.headerRow}>
          {showBackIcon && (
            <TouchableOpacity
              onPress={onBackPress || (() => navigation.goBack())}
              style={{
                marginRight: 8,
                backgroundColor: Colors.bgCard,
                padding: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: Colors.borderDark,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={headerConfig.backIconColor || Colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          <Text
            style={[
              styles.greetingText,
              { color: headerConfig.titleColor },
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
              { color: headerConfig.subtitleColor },
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
  );

  return (
    <View style={[styles.headerContent, { overflow: "hidden" }]}>
      <StatusBar
        translucent={transparent}
        backgroundColor="transparent"
        barStyle="light-content"
        animated
      />
      {headerConfig.backgroundImage ? (
        <ImageBackground
          source={{ uri: headerConfig.backgroundImage }}
          style={{
            minHeight: compact ? 90 : showTabs ? 200 : 130,
          }}
          imageStyle={styles.headerImageStyle}
        >
          {renderHeaderContent()}
        </ImageBackground>
      ) : (
        renderHeaderContent()
      )}
    </View>
  );
};

export default DashboardHeader;
