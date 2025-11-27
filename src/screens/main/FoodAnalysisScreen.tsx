// FoodAnalysisScreen.tsx - Redesigned with organic, friendly aesthetic
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAppDispatch } from "@/redux/store/hooks";
import { fetchFoodAnalysis } from "@/redux/slice/mealPlanSlice";
import { showModal } from "@/redux/slice/modalSlice";
import * as ImagePicker from "expo-image-picker";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface FoodAnalysisScreenProps {
  navigation: any;
  route: any;
}

// Sample data
const RECENT_MEALS = [
  {
    id: 1,
    name: "Berry Smoothie",
    type: "Breakfast",
    calories: 220,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&q=80",
    action: "Quick Re-log",
    actionIcon: "refresh-cw",
  },
  {
    id: 2,
    name: "Grilled Salmon & Veggies",
    type: "Lunch",
    calories: 520,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80",
    action: "Quick Re-log",
    actionIcon: "refresh-cw",
  },
  {
    id: 3,
    name: "Lent Soup",
    type: "Dinner",
    calories: 180,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&q=80",
    action: "Cook from Pantry",
    actionIcon: "book-open",
  },
];

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast", icon: "sunny-outline" },
  { id: "lunch", label: "Lunch", icon: "restaurant-outline" },
  { id: "dinner", label: "Dinner", icon: "moon-outline" },
  { id: "snack", label: "Snack", icon: "nutrition-outline" },
];

// Animated circular progress component
const CircularProgress = ({ 
  current, 
  total, 
  size = 100, 
  strokeWidth = 8,
  animatedValue 
}: { 
  current: number; 
  total: number; 
  size?: number; 
  strokeWidth?: number;
  animatedValue: Animated.Value;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / total, 1);
  
  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - progress)],
  });

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#7CB342" />
            <Stop offset="100%" stopColor="#AED581" />
          </SvgGradient>
        </Defs>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8F5E9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressCalories}>{current}</Text>
        <Text style={styles.progressUnit}>kcal</Text>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const FoodAnalysisScreen: React.FC<FoodAnalysisScreenProps> = ({
  navigation,
  route,
}) => {
  const [query, setQuery] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const mascotBounce = useRef(new Animated.Value(0)).current;
  const mealCardScale = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recentMealsAnim = useRef(RECENT_MEALS.map(() => new Animated.Value(0))).current;

  const currentMealType = route?.params?.mealType || "breakfast";
  const currentCalories = 780;
  const goalCalories = 1800;
  const breakfastCalories = 340;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(mealCardScale, {
        toValue: 1,
        delay: 400,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Toast animation
    Animated.sequence([
      Animated.delay(500),
      Animated.spring(toastAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowToast(false));

    // Mascot bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotBounce, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(mascotBounce, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for the meal image
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Staggered animation for recent meals
    recentMealsAnim.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 600 + index * 100,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu");
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setQuery("");
      }
    }
  };

  const handleUploadImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setQuery("");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!query && !selectedImageUri) return;

    try {
      setLoading(true);
      let payload: any;

      if (selectedImageUri) {
        payload = {
          analysis_type: "image",
          input_data: { image_data: selectedImageUri },
          response_level: "detailed",
        };
      } else if (query) {
        payload = {
          analysis_type: "text",
          input_data: { text_description: query },
          response_level: "detailed",
        };
      }

      const resultAction = await dispatch(fetchFoodAnalysis(payload));
      navigation.navigate("AnalysisResults", {
        analysisData: resultAction.payload,
        foodName: query,
        inputType: selectedImageUri ? "image" : "text",
      });
    } catch (error) {
      dispatch(
        showModal({
          type: "error",
          message: "Failed to analyze food. Please try again.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecentMeal = (meal: any) => {
    setQuery(meal.name);
  };

  const getMealTypeLabel = () => {
    const meal = MEAL_TYPES.find(m => m.id === selectedMealType);
    return meal?.label || "Breakfast";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#5D6B5D" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Feather name="menu" size={22} color="#5D6B5D" />
          </TouchableOpacity>
        </Animated.View>

        {/* Mascot */}
        <Animated.View 
          style={[
            styles.mascotContainer,
            { transform: [{ translateY: mascotBounce }] }
          ]}
        >
          <View style={styles.mascotWrapper}>
            <View style={styles.mascot}>
              <Text style={styles.mascotFace}>🥗</Text>
            </View>
            <View style={styles.mascotLeaf}>
              <Text style={{ fontSize: 16 }}>🌱</Text>
            </View>
          </View>
        </Animated.View>

        {/* Today's Fuel Section */}
        <Animated.View 
          style={[
            styles.fuelSection,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.fuelTitle}>Today's Fuel</Text>
          <Text style={styles.fuelSubtitle}>{currentCalories} / {goalCalories} kcal</Text>
        </Animated.View>

        {/* Main Circular Display */}
        <View style={styles.circularContainer}>
          {/* Left Progress Circle */}
          <View style={styles.progressCircleWrapper}>
            <CircularProgress 
              current={currentCalories} 
              total={goalCalories}
              size={90}
              strokeWidth={8}
              animatedValue={progressAnim}
            />
          </View>

          {/* Center Meal Display */}
          <Animated.View 
            style={[
              styles.mealDisplayContainer,
              { 
                transform: [{ scale: mealCardScale }]
              }
            ]}
          >
            {/* Decorative ring */}
            <View style={styles.mealRingOuter}>
              <View style={styles.mealRingInner}>
                <View style={styles.mealImageContainer}>
                  {selectedImageUri ? (
                    <Image source={{ uri: selectedImageUri }} style={styles.mealImage} />
                  ) : (
                    <Animated.Image 
                      source={{ uri: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&q=80" }}
                      style={[styles.mealImage, { transform: [{ scale: pulseAnim }] }]}
                    />
                  )}
                </View>
              </View>
            </View>
            
            {/* Meal Type Badge */}
            <View style={styles.mealTypeBadge}>
              <Text style={styles.mealTypeText}>{getMealTypeLabel()}</Text>
            </View>
            
            {/* Calories Badge */}
            <View style={styles.caloriesBadge}>
              <Text style={styles.caloriesText}>{breakfastCalories} kcal</Text>
            </View>
          </Animated.View>

          {/* Toast Notification */}
          {showToast && (
            <Animated.View 
              style={[
                styles.toastContainer,
                {
                  opacity: toastAnim,
                  transform: [
                    { 
                      translateY: toastAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      })
                    },
                    {
                      scale: toastAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      })
                    }
                  ]
                }
              ]}
            >
              <Ionicons name="checkmark-circle" size={16} color="#7CB342" />
              <Text style={styles.toastText}>Got it! Avocado Toast logged</Text>
            </Animated.View>
          )}
        </View>

        {/* Smart Suggestions Section */}
        <Animated.View 
          style={[
            styles.section,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Smart Suggestions</Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchIconWrapper}>
              <Ionicons name="restaurant-outline" size={18} color="#9CA3AF" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Longevity meal, Mani..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity style={styles.searchActionButton}>
              <Ionicons name="mic-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.searchActionButton}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Meal Type Selector */}
        <View style={styles.mealTypeSelector}>
          {MEAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.mealTypeButton,
                selectedMealType === type.id && styles.mealTypeButtonActive
              ]}
              onPress={() => setSelectedMealType(type.id)}
            >
              <Ionicons 
                name={type.icon as any} 
                size={18} 
                color={selectedMealType === type.id ? "#fff" : "#6B7280"} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          
          {RECENT_MEALS.map((meal, index) => (
            <Animated.View
              key={meal.id}
              style={[
                styles.recentMealCard,
                {
                  opacity: recentMealsAnim[index],
                  transform: [
                    {
                      translateX: recentMealsAnim[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 0],
                      })
                    }
                  ]
                }
              ]}
            >
              <Image source={{ uri: meal.image }} style={styles.recentMealImage} />
              <View style={styles.recentMealInfo}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleAddRecentMeal(meal)}
                >
                  <Feather name={meal.actionIcon as any} size={14} color="#7CB342" />
                  <Text style={styles.actionText}>{meal.action}: {meal.name}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="#7CB342" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={handleUploadImage}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="image-outline" size={24} color="#7CB342" />
            </View>
            <Text style={styles.quickActionText}>Upload Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={handleTakePhoto}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="scan-outline" size={24} color="#7CB342" />
            </View>
            <Text style={styles.quickActionText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Image Preview */}
        {selectedImageUri && (
          <Animated.View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImageUri }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setSelectedImageUri(null)}
            >
              <Ionicons name="close-circle" size={28} color="#EF4444" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Spacer for bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Analyze Button */}
      {(query || selectedImageUri) && (
        <Animated.View 
          style={[
            styles.analyzeButtonContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyze}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8BC34A", "#689F38"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.analyzeGradient}
            >
              <Text style={styles.analyzeText}>
                {loading ? "Analyzing..." : "Log Meal"}
              </Text>
              <View style={styles.analyzeArrow}>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFDF7",
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 16,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Mascot
  mascotContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  mascotWrapper: {
    position: "relative",
  },
  mascot: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8BC34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  mascotFace: {
    fontSize: 36,
  },
  mascotLeaf: {
    position: "absolute",
    top: -5,
    right: -5,
  },

  // Fuel Section
  fuelSection: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  fuelTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3B2D",
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  fuelSubtitle: {
    fontSize: 15,
    color: "#6B7B6B",
    marginTop: 4,
    letterSpacing: 0.5,
  },

  // Circular Container
  circularContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 25,
    minHeight: 280,
  },
  progressCircleWrapper: {
    position: "absolute",
    left: 30,
    top: 20,
    zIndex: 10,
  },
  progressTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  progressCalories: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3B2D",
  },
  progressUnit: {
    fontSize: 11,
    color: "#6B7B6B",
    marginTop: -2,
  },

  // Meal Display
  mealDisplayContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  mealRingOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(139, 195, 74, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8BC34A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  mealRingInner: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(139, 195, 74, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  mealImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mealTypeBadge: {
    position: "absolute",
    top: -5,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3B2D",
    letterSpacing: 0.3,
  },
  caloriesBadge: {
    position: "absolute",
    bottom: -5,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#C5E1A5",
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#558B2F",
  },

  // Toast
  toastContainer: {
    position: "absolute",
    right: 20,
    top: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    maxWidth: 200,
  },
  toastText: {
    fontSize: 12,
    color: "#2D3B2D",
    marginLeft: 6,
    fontWeight: "500",
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3B2D",
    marginBottom: 14,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },

  // Search Container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  searchIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F5F9F5",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#2D3B2D",
    marginLeft: 12,
    paddingVertical: 10,
  },
  searchActionButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F5F9F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  // Meal Type Selector
  mealTypeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  mealTypeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  mealTypeButtonActive: {
    backgroundColor: "#8BC34A",
    borderColor: "#8BC34A",
    shadowColor: "#8BC34A",
    shadowOpacity: 0.3,
  },

  // Recent Meals
  recentMealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F5F0",
  },
  recentMealImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  recentMealInfo: {
    flex: 1,
    marginLeft: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F9F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  actionText: {
    fontSize: 13,
    color: "#2D3B2D",
    marginLeft: 6,
    fontWeight: "500",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  // Quick Actions
  quickActionsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0F9F0",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D3B2D",
    marginLeft: 12,
  },

  // Selected Image
  selectedImageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
  removeImageBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
  },

  // Analyze Button
  analyzeButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  analyzeButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#689F38",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  analyzeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  analyzeText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  analyzeArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});

export default FoodAnalysisScreen;