// FoodAnalysisResultsScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DashboardHeader from "@/components/DashboardHeader";
import { Colors } from "@/constants/Colors";
import MacroCard from "@/components/foodanalysis/MacroCard";
import NutrientsSection from "@/components/foodanalysis/NutrientsSection";
import QualityScoreSection from "@/components/foodanalysis/QualityScoreSection";
import FoodItemCard from "@/components/foodanalysis/FoodItemCard";
import WarningsSection from "@/components/foodanalysis/WarningsSection";
import ActionButtons from "@/components/foodanalysis/ActionButtons";
import { verticalScale } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";

interface FoodAnalysisResultsScreenProps {
  navigation: any;
  route: any;
}

const FoodAnalysisResultsScreen: React.FC<FoodAnalysisResultsScreenProps> = ({
  navigation,
  route,
}) => {
  const { analysisData, foodName, inputType } = route.params || {};

  const headerBg = Colors.bgPrimary;

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(headerBg);
    }
    StatusBar.setBarStyle("light-content");
  }, []);

  if (!analysisData) {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={headerBg}
          barStyle="light-content"
          animated
        />
        <Text style={styles.errorText}>No analysis data available</Text>
      </View>
    );
  }

  const total_nutrition = analysisData.total_nutrition || {
    calories_kcal: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  };

  const identified_foods = analysisData.identified_foods || [];
  const safety_assessment = analysisData.safety_assessment || { warnings: [] };

  const displayFoodName =
    analysisData?.meal_name ||
    (identified_foods?.length > 0
      ? identified_foods.map((f) => f.food_name).join(", ")
      : null) ||
    foodName ||
    "Analyzed Food";

  // Get input type icon and label
  const getInputTypeInfo = () => {
    switch (inputType) {
      case "voice":
        return { icon: "mic", label: "Voice Input", color: "#FF6B35" };
      case "image":
        return { icon: "camera", label: "Image Analysis", color: "#4CAF50" };
      case "text":
      default:
        return { icon: "text", label: "Text Input", color: "#2196F3" };
    }
  };

  const inputTypeInfo = getInputTypeInfo();
  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu");
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={headerBg} barStyle="light-content" animated />

      <View style={styles.headerCard}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
          }}
          style={styles.headerImageBg}
          imageStyle={styles.headerImageStyle}
        >
          <LinearGradient
            colors={["rgba(5, 150, 105, 0.95)", "rgba(52, 211, 153, 0.90)"]}
            style={styles.headerOverlay}
          >
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.titleWithBg}>Log Your Meal</Text>
                <Text style={styles.subtitleWithBg}>Track What You Eat</Text>
              </View>
              <TouchableOpacity
                onPress={handleMenuPress}
                style={{
                  padding: 8,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.25)",
                }}
              >
                <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.descriptionWithBg}>
              Choose how you want to log your meal
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Input Type Indicator with User Query */}
      {inputType && (
        <View style={styles.inputTypeContainer}>
          {/* <View style={[styles.inputTypeBadge, { backgroundColor: inputTypeInfo.color }]}>
            <Ionicons name={inputTypeInfo.icon as any} size={16} color={Colors.white} />
            <Text style={styles.inputTypeText}>{inputTypeInfo.label}</Text>
          </View> */}

          {/* Show user's original query/prompt */}
          {foodName && (inputType === "voice" || inputType === "text") && (
            <View style={styles.userQueryContainer}>
              <Text style={styles.userQueryLabel}>
                Your {inputType === "voice" ? "Voice" : "Text"} Input:
              </Text>
              <View style={styles.queryBubble}>
                <Ionicons
                  name={inputType === "voice" ? "mic" : "chatbubble-ellipses"}
                  size={14}
                  color={Colors.textMuted}
                  style={styles.queryIcon}
                />
                <Text style={styles.userQueryText}>"{foodName}"</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MacroCard totalNutrition={total_nutrition} />

        <NutrientsSection totalNutrition={total_nutrition} />

        <QualityScoreSection totalNutrition={total_nutrition} />

        {identified_foods.length > 0 && (
          <View style={styles.foodItemsContainer}>
            <Text style={styles.sectionTitle}>Identified Foods</Text>
            {identified_foods.map((food, index) => (
              <FoodItemCard key={`${food.food_name}-${index}`} food={food} />
            ))}
          </View>
        )}

        {safety_assessment.warnings &&
          safety_assessment.warnings.length > 0 && (
            <WarningsSection warnings={safety_assessment.warnings} />
          )}

        <ActionButtons navigation={navigation} analysisData={analysisData} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    paddingBottom: verticalScale(60),
  },
  menuIcon: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 20,
    padding: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 40,
  },
  inputTypeContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  inputTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  inputTypeText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  userQueryContainer: {
    marginTop: 12,
  },
  userQueryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  queryBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.emerald,
  },
  queryIcon: {
    marginRight: 8,
  },
  userQueryText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: "italic",
    lineHeight: 20,
  },
  foodItemsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  headerCard: {
    height: 130,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.bgCard,
    elevation: 6,
    shadowColor: Colors.emerald,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },

  headerImageBg: {
    flex: 1,
    justifyContent: "flex-end",
  },

  titleWithBg: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },

  subtitleWithBg: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginTop: 2,
  },

  descriptionWithBg: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.9,
    marginTop: 10,
  },
  headerImageStyle: {
    borderRadius: 20,
    resizeMode: "cover",
  },

  headerOverlay: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
    borderRadius: 20,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FoodAnalysisResultsScreen;
