// FoodAnalysisScreen.tsx - Premium Dark Theme Redesign
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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@/redux/store/hooks";
import { fetchFoodAnalysis } from "@/redux/slice/mealPlanSlice";
import { showModal } from "@/redux/slice/modalSlice";
import * as ImagePicker from "expo-image-picker";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

// ============================================
// THEME CONFIGURATION
// ============================================
const Theme = {
  // Backgrounds
  bgPrimary: "#0A0A0C",
  bgCard: "rgba(255, 255, 255, 0.04)",
  bgCardHover: "rgba(255, 255, 255, 0.08)",
  bgInput: "rgba(255, 255, 255, 0.06)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.75)",
  textMuted: "rgba(255, 255, 255, 0.45)",
  textLabel: "rgba(255, 255, 255, 0.55)",

  // Accent Colors
  emerald: "#34D399",
  emeraldLight: "#6EE7B7",
  emeraldDark: "#059669",
  cyan: "#22D3EE",
  cyanLight: "#67E8F9",
  cyanDark: "#0891B2",
  amber: "#FBBF24",
  amberLight: "#FCD34D",
  orange: "#FB923C",
  red: "#F87171",
  purple: "#A78BFA",
  blue: "#60A5FA",
  pink: "#F472B6",

  // Borders
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.04)",

  // Gradients
  emeraldGradient: ["#059669", "#34D399"],
  cyanGradient: ["#0891B2", "#22D3EE"],
};

// ============================================
// TYPES
// ============================================
interface FoodAnalysisScreenProps {
  navigation: any;
  route: any;
}

interface DetectedRegion {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface ImageAnalysis {
  type: string;
  summary: string;
  confidence: number;
  regions: DetectedRegion[];
  totalNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// ============================================
// CONSTANTS
// ============================================
const RECENT_MEALS = [
  {
    id: 1,
    name: "Berry Smoothie",
    type: "Breakfast",
    calories: 220,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&q=80",
    emoji: "🫐",
  },
  {
    id: 2,
    name: "Grilled Salmon",
    type: "Lunch",
    calories: 520,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80",
    emoji: "🐟",
  },
  {
    id: 3,
    name: "Lentil Soup",
    type: "Dinner",
    calories: 180,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&q=80",
    emoji: "🍲",
  },
  {
    id: 4,
    name: "Greek Yogurt",
    type: "Snack",
    calories: 150,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80",
    emoji: "🥛",
  },
];

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast", emoji: "🌅", color: Theme.amber },
  { id: "lunch", label: "Lunch", emoji: "☀️", color: Theme.orange },
  { id: "dinner", label: "Dinner", emoji: "🌙", color: Theme.purple },
  { id: "snack", label: "Snack", emoji: "🍎", color: Theme.emerald },
];

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================
const CircularProgress = ({
  current,
  total,
  size = 100,
  strokeWidth = 10,
  animatedValue,
  color = Theme.emerald,
}: {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  animatedValue: Animated.Value;
  color?: string;
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
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </SvgGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
        <Text style={styles.progressLabel}>of {total}</Text>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ============================================
// MACRO BAR COMPONENT
// ============================================
const MacroBar = ({ label, current, goal, color, icon }: { label: string; current: number; goal: number; color: string; icon: string }) => {
  const percent = Math.min((current / goal) * 100, 100);

  return (
    <View style={styles.macroBarContainer}>
      <View style={styles.macroBarHeader}>
        <View style={styles.macroBarLabelRow}>
          <View style={[styles.macroBarIcon, { backgroundColor: `${color}20` }]}>
            <MaterialCommunityIcons name={icon as any} size={14} color={color} />
          </View>
          <Text style={styles.macroBarLabel}>{label}</Text>
        </View>
        <Text style={styles.macroBarValue}>
          {current}<Text style={styles.macroBarGoal}>/{goal}g</Text>
        </Text>
      </View>
      <View style={styles.macroBarTrack}>
        <LinearGradient
          colors={[color, `${color}80`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.macroBarFill, { width: `${percent}%` }]}
        />
      </View>
    </View>
  );
};

// ============================================
// IMAGE SCANNER SECTION COMPONENT
// ============================================
interface ImageScannerSectionProps {
  imageUri: string;
  onClose: () => void;
  onAnalysisComplete: (analysis: ImageAnalysis) => void;
  onLogMeal: (analysis: ImageAnalysis) => void;
}

const ImageScannerSection: React.FC<ImageScannerSectionProps> = ({
  imageUri,
  onClose,
  onAnalysisComplete,
  onLogMeal,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const [currentHighlight, setCurrentHighlight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const flickerAnim = useRef(new Animated.Value(0.1)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const markerAnims = useRef<Animated.Value[]>([]).current;

  const IMAGE_HEIGHT = 260;

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      startScan();
    });
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setImageAnalysis(null);
    setError(null);
    scanLineAnim.setValue(0);

    Animated.timing(scanLineAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, { toValue: 0.3, duration: 150, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 0.1, duration: 150, useNativeDriver: true }),
      ])
    ).start();

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  useEffect(() => {
    if (scanProgress >= 100 && isScanning) {
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        analyzeImage();
      }, 300);
    }
  }, [scanProgress, isScanning]);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockAnalysis: ImageAnalysis = {
        type: "food",
        summary: "Healthy breakfast plate with balanced macros",
        confidence: 94,
        regions: [
          {
            id: "1",
            label: "Avocado Toast",
            description: "Whole grain bread with mashed avocado",
            x: 15, y: 20, w: 35, h: 40,
            nutrition: { calories: 280, protein: 8, carbs: 32, fat: 14, fiber: 8 },
          },
          {
            id: "2",
            label: "Scrambled Eggs",
            description: "Two eggs, lightly scrambled",
            x: 55, y: 25, w: 30, h: 35,
            nutrition: { calories: 180, protein: 14, carbs: 2, fat: 12, fiber: 0 },
          },
          {
            id: "3",
            label: "Mixed Berries",
            description: "Fresh strawberries and blueberries",
            x: 60, y: 65, w: 25, h: 25,
            nutrition: { calories: 45, protein: 1, carbs: 11, fat: 0, fiber: 3 },
          },
        ],
        totalNutrition: { calories: 505, protein: 23, carbs: 45, fat: 26 },
      };

      setImageAnalysis(mockAnalysis);
      onAnalysisComplete(mockAnalysis);

      mockAnalysis.regions.forEach((_, index) => {
        if (!markerAnims[index]) markerAnims[index] = new Animated.Value(0);
        Animated.spring(markerAnims[index], {
          toValue: 1,
          delay: index * 200,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }).start();
      });

      highlightRegionsSequentially(mockAnalysis.regions);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const highlightRegionsSequentially = (regions: DetectedRegion[]) => {
    if (!regions || regions.length === 0) return;
    regions.forEach((region, index) => {
      setTimeout(() => {
        setCurrentHighlight(region.id);
        if (index === regions.length - 1) {
          setTimeout(() => setCurrentHighlight(null), 2000);
        }
      }, index * 1200);
    });
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, IMAGE_HEIGHT],
  });

  return (
    <Animated.View style={[styles.scannerSection, { opacity: fadeInAnim }]}>
      {/* Scanner Header */}
      <View style={styles.scannerHeader}>
        <View style={styles.scannerHeaderLeft}>
          <View style={[
            styles.scannerStatusDot,
            isScanning && styles.scannerStatusDotScanning,
            isAnalyzing && styles.scannerStatusDotAnalyzing,
            scanComplete && !isAnalyzing && styles.scannerStatusDotComplete,
          ]} />
          <Text style={styles.scannerTitle}>
            {isScanning ? "Scanning..." : isAnalyzing ? "Analyzing..." : scanComplete ? "Complete" : "Ready"}
          </Text>
        </View>
        <TouchableOpacity style={styles.scannerCloseBtn} onPress={onClose}>
          <Ionicons name="close" size={18} color={Theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Image Container */}
      <View style={styles.scannerImageContainer}>
        <Image source={{ uri: imageUri }} style={[styles.scannerImage, !scanComplete && { opacity: 0.5 }]} />

        {/* Scanning Effects */}
        {isScanning && (
          <>
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineTranslateY }] }]}>
              <LinearGradient
                colors={["transparent", Theme.cyan, "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.scanLineGradient}
              />
            </Animated.View>
            <Animated.View style={[styles.scanGlow, { transform: [{ translateY: scanLineTranslateY }] }]}>
              <LinearGradient
                colors={[`${Theme.cyan}60`, `${Theme.cyan}20`, "transparent"]}
                style={styles.scanGlowGradient}
              />
            </Animated.View>
            <Animated.View style={[styles.flickerOverlay, { opacity: flickerAnim }]} />
          </>
        )}

        {/* Detected Region Markers */}
        {scanComplete && imageAnalysis && imageAnalysis.regions.map((region, index) => {
          const centerX = region.x + region.w / 2;
          const centerY = region.y + region.h / 2;
          const isHighlighted = currentHighlight === region.id;
          const markerAnim = markerAnims[index] || new Animated.Value(1);

          return (
            <Animated.View
              key={region.id}
              style={[
                styles.regionMarker,
                {
                  left: `${centerX}%`,
                  top: `${centerY}%`,
                  transform: [{ translateX: -14 }, { translateY: -14 }, { scale: markerAnim }],
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.markerCircle, isHighlighted && styles.markerCircleHighlighted]}
                onPress={() => setCurrentHighlight(isHighlighted ? null : region.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.markerNumber}>{index + 1}</Text>
              </TouchableOpacity>
              {isHighlighted && (
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText}>{region.label}</Text>
                  {region.nutrition && (
                    <Text style={styles.markerLabelCalories}>{region.nutrition.calories} kcal</Text>
                  )}
                </View>
              )}
            </Animated.View>
          );
        })}

        {/* Analyzing Overlay */}
        {isAnalyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color={Theme.cyan} />
            <Text style={styles.analyzingText}>Analyzing with AI...</Text>
            <Text style={styles.analyzingSubtext}>Identifying food items</Text>
          </View>
        )}

        {/* Corner Brackets */}
        <View style={[styles.cornerBracket, styles.cornerTL]} />
        <View style={[styles.cornerBracket, styles.cornerTR]} />
        <View style={[styles.cornerBracket, styles.cornerBL]} />
        <View style={[styles.cornerBracket, styles.cornerBR]} />
      </View>

      {/* Progress Bar */}
      {isScanning && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarHeader}>
            <Text style={styles.progressBarLabel}>SCANNING</Text>
            <Text style={styles.progressBarPercent}>{scanProgress}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <LinearGradient
              colors={Theme.cyanGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${scanProgress}%` }]}
            />
          </View>
        </View>
      )}

      {/* Analysis Results */}
      {scanComplete && imageAnalysis && !error && (
        <View style={styles.analysisResults}>
          {/* Summary */}
          <View style={styles.analysisSummary}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="checkmark-circle" size={22} color={Theme.emerald} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>{imageAnalysis.summary}</Text>
              <View style={styles.summaryMeta}>
                <Text style={styles.summaryMetaText}>{imageAnalysis.regions.length} items</Text>
                <View style={styles.summaryMetaDot} />
                <Text style={styles.summaryMetaText}>{imageAnalysis.confidence}% confidence</Text>
              </View>
            </View>
          </View>

          {/* Total Nutrition */}
          {imageAnalysis.totalNutrition && (
            <View style={styles.totalNutrition}>
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: Theme.emerald }]}>{imageAnalysis.totalNutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: Theme.blue }]}>{imageAnalysis.totalNutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: Theme.amber }]}>{imageAnalysis.totalNutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: Theme.pink }]}>{imageAnalysis.totalNutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          )}

          {/* Detected Items List */}
          <View style={styles.detectedItemsList}>
            <Text style={styles.detectedItemsTitle}>DETECTED ITEMS</Text>
            {imageAnalysis.regions.map((region, index) => (
              <TouchableOpacity
                key={region.id}
                style={[styles.detectedItem, currentHighlight === region.id && styles.detectedItemHighlighted]}
                onPress={() => setCurrentHighlight(currentHighlight === region.id ? null : region.id)}
                activeOpacity={0.7}
              >
                <View style={styles.detectedItemNumber}>
                  <Text style={styles.detectedItemNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.detectedItemInfo}>
                  <Text style={styles.detectedItemName}>{region.label}</Text>
                  <Text style={styles.detectedItemDesc}>{region.description}</Text>
                </View>
                {region.nutrition && (
                  <Text style={styles.detectedItemCalories}>{region.nutrition.calories} kcal</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.scannerActions}>
            <TouchableOpacity style={styles.rescanBtn} onPress={startScan} activeOpacity={0.8}>
              <Ionicons name="refresh" size={18} color={Theme.cyan} />
              <Text style={styles.rescanBtnText}>Rescan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logMealBtn} onPress={() => onLogMeal(imageAnalysis)} activeOpacity={0.9}>
              <LinearGradient colors={Theme.emeraldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logMealBtnGradient}>
                <Text style={styles.logMealBtnText}>Log This Meal</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color={Theme.red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={startScan}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

// ============================================
// MAIN FOOD ANALYSIS SCREEN
// ============================================
const FoodAnalysisScreen: React.FC<FoodAnalysisScreenProps> = ({ navigation, route }) => {
  const [query, setQuery] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [inputFocused, setInputFocused] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const dispatch = useAppDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const inputScaleAnim = useRef(new Animated.Value(1)).current;
  const recentMealsAnim = useRef(RECENT_MEALS.map(() => new Animated.Value(0))).current;
  const mealTypeAnims = useRef(MEAL_TYPES.map(() => new Animated.Value(0))).current;

  const currentCalories = 780;
  const goalCalories = 1800;
  const remaining = goalCalories - currentCalories;
  const caloriesPercent = Math.round((currentCalories / goalCalories) * 100);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.timing(progressAnim, { toValue: 1, duration: 1000, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    mealTypeAnims.forEach((anim, index) => {
      Animated.spring(anim, { toValue: 1, delay: 300 + index * 80, friction: 8, tension: 50, useNativeDriver: true }).start();
    });

    recentMealsAnim.forEach((anim, index) => {
      Animated.spring(anim, { toValue: 1, delay: 500 + index * 100, friction: 8, tension: 40, useNativeDriver: true }).start();
    });
  }, []);

  const handleInputFocus = () => {
    setInputFocused(true);
    Animated.spring(inputScaleAnim, { toValue: 1.02, friction: 8, useNativeDriver: true }).start();
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    Animated.spring(inputScaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
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
        setShowScanner(true);
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
        setShowScanner(true);
      }
    }
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setSelectedImageUri(null);
  };

  const handleAnalysisComplete = (analysis: ImageAnalysis) => {
    console.log("Analysis complete:", analysis);
  };

  const handleLogMeal = async (analysis: ImageAnalysis) => {
    try {
      setLoading(true);
      navigation.navigate("AnalysisResults", { analysisData: analysis, inputType: "image" });
    } catch (error) {
      dispatch(showModal({ type: "error", message: "Failed to log meal. Please try again." }));
    } finally {
      setLoading(false);
      setShowScanner(false);
      setSelectedImageUri(null);
    }
  };

  const handleTextAnalyze = async () => {
    if (!query) return;
    try {
      setLoading(true);
      const payload = {
        analysis_type: "text",
        input_data: { text_description: query },
        response_level: "detailed",
      };
      const resultAction = await dispatch(fetchFoodAnalysis(payload));
      navigation.navigate("AnalysisResults", { analysisData: resultAction.payload, foodName: query, inputType: "text" });
    } catch (error) {
      dispatch(showModal({ type: "error", message: "Failed to analyze food. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const getMealTypeData = () => MEAL_TYPES.find(m => m.id === selectedMealType) || MEAL_TYPES[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPrimary} />

      {/* Light Ambient Background */}
      <View style={styles.ambientBg}>
        <LinearGradient
          colors={["rgba(52, 211, 153, 0.06)", "transparent"]}
          style={styles.ambientOrb1}
        />
        <LinearGradient
          colors={["rgba(34, 211, 238, 0.04)", "transparent"]}
          style={styles.ambientOrb2}
        />
        <LinearGradient
          colors={["rgba(251, 191, 36, 0.03)", "transparent"]}
          style={styles.ambientOrb3}
        />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={Theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Log Meal</Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeEmoji}>{getMealTypeData().emoji}</Text>
              <Text style={styles.headerBadgeText}>{getMealTypeData().label}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("AllScreensMenu")}>
            <Ionicons name="ellipsis-horizontal" size={22} color={Theme.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Progress Card */}
        <Animated.View style={[styles.progressCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.progressCardHeader}>
            <Text style={styles.progressCardTitle}>Today's Progress</Text>
            <View style={styles.remainingBadge}>
              <Ionicons name="flame" size={14} color={Theme.emerald} />
              <Text style={styles.remainingText}>{remaining} remaining</Text>
            </View>
          </View>

          <View style={styles.progressContent}>
            <View style={styles.progressRingContainer}>
              <CircularProgress
                current={currentCalories}
                total={goalCalories}
                size={120}
                strokeWidth={10}
                animatedValue={progressAnim}
                color={Theme.emerald}
              />
            </View>

            <View style={styles.macrosContainer}>
              <MacroBar label="Protein" current={68} goal={120} color={Theme.blue} icon="food-steak" />
              <MacroBar label="Carbs" current={95} goal={200} color={Theme.amber} icon="bread-slice" />
              <MacroBar label="Fat" current={32} goal={65} color={Theme.pink} icon="water" />
            </View>
          </View>
        </Animated.View>

        {/* Meal Type Selector */}
        <View style={styles.mealTypeContainer}>
          <Text style={styles.sectionLabel}>MEAL TYPE</Text>
          <View style={styles.mealTypeRow}>
            {MEAL_TYPES.map((type, index) => (
              <Animated.View
                key={type.id}
                style={{
                  opacity: mealTypeAnims[index],
                  transform: [{ scale: mealTypeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]
                }}
              >
                <TouchableOpacity
                  style={[styles.mealTypeButton, selectedMealType === type.id && styles.mealTypeButtonActive]}
                  onPress={() => setSelectedMealType(type.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.mealTypeEmoji}>{type.emoji}</Text>
                  <Text style={[styles.mealTypeLabel, selectedMealType === type.id && styles.mealTypeLabelActive]}>
                    {type.label}
                  </Text>
                  {selectedMealType === type.id && (
                    <View style={[styles.mealTypeIndicator, { backgroundColor: type.color }]} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Image Scanner Section */}
        {showScanner && selectedImageUri && (
          <ImageScannerSection
            imageUri={selectedImageUri}
            onClose={handleCloseScanner}
            onAnalysisComplete={handleAnalysisComplete}
            onLogMeal={handleLogMeal}
          />
        )}

        {/* Input Section */}
        {!showScanner && (
          <Animated.View style={[styles.inputSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: inputScaleAnim }] }]}>
            <Text style={styles.sectionLabel}>ADD FOOD</Text>

            {/* Search Input */}
            <View style={[styles.inputCard, inputFocused && styles.inputCardFocused]}>
              <View style={styles.inputRow}>
                <Ionicons name="search" size={20} color={Theme.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Search or describe your meal..."
                  placeholderTextColor={Theme.textMuted}
                  value={query}
                  onChangeText={setQuery}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  multiline={false}
                  onSubmitEditing={handleTextAnalyze}
                  returnKeyType="search"
                />
                {query.length > 0 && (
                  <TouchableOpacity style={styles.clearBtn} onPress={() => setQuery("")}>
                    <Ionicons name="close-circle" size={20} color={Theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={styles.quickActionBtn} onPress={() => {}} activeOpacity={0.7}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${Theme.purple}20` }]}>
                  <Ionicons name="mic" size={22} color={Theme.purple} />
                </View>
                <Text style={styles.quickActionLabel}>Voice</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionBtn} onPress={handleTakePhoto} activeOpacity={0.7}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${Theme.cyan}20` }]}>
                  <Ionicons name="camera" size={22} color={Theme.cyan} />
                </View>
                <Text style={styles.quickActionLabel}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionBtn} onPress={handleUploadImage} activeOpacity={0.7}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${Theme.emerald}20` }]}>
                  <Ionicons name="image" size={22} color={Theme.emerald} />
                </View>
                <Text style={styles.quickActionLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionBtn} onPress={() => {}} activeOpacity={0.7}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${Theme.orange}20` }]}>
                  <Ionicons name="barcode" size={22} color={Theme.orange} />
                </View>
                <Text style={styles.quickActionLabel}>Barcode</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Suggestions */}
            <View style={styles.suggestionsRow}>
              {['Avocado Toast', 'Smoothie Bowl', 'Chicken Salad'].map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => setQuery(suggestion)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Recent Meals Section */}
        {!showScanner && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Meals</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentMealsScroll}>
              {RECENT_MEALS.map((meal, index) => (
                <Animated.View
                  key={meal.id}
                  style={[
                    styles.recentMealCard,
                    {
                      opacity: recentMealsAnim[index],
                      transform: [{ translateY: recentMealsAnim[index].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
                    }
                  ]}
                >
                  <TouchableOpacity style={styles.recentMealContent} onPress={() => setQuery(meal.name)} activeOpacity={0.8}>
                    <Image source={{ uri: meal.image }} style={styles.recentMealImage} />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={styles.recentMealGradient}
                    >
                      <View style={styles.recentMealInfo}>
                        <Text style={styles.recentMealName} numberOfLines={1}>{meal.name}</Text>
                        <Text style={styles.recentMealCalories}>{meal.calories} kcal</Text>
                      </View>
                    </LinearGradient>
                    <View style={styles.recentMealBadge}>
                      <Text style={styles.recentMealEmoji}>{meal.emoji}</Text>
                    </View>
                    <TouchableOpacity style={styles.quickAddBtn}>
                      <Ionicons name="add" size={18} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Spacer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Search Button */}
      {query && !showScanner && (
        <Animated.View
          style={[
            styles.floatingButtonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }]
            }
          ]}
        >
          <TouchableOpacity style={styles.floatingButton} onPress={handleTextAnalyze} disabled={loading} activeOpacity={0.9}>
            <LinearGradient colors={Theme.emeraldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.floatingButtonGradient}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.floatingButtonText}>Search "{query}"</Text>
                  <View style={styles.floatingButtonArrow}>
                    <Ionicons name="search" size={18} color="#fff" />
                  </View>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bgPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Ambient Background
  ambientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  ambientOrb1: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  ambientOrb2: {
    position: "absolute",
    top: 280,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  ambientOrb3: {
    position: "absolute",
    bottom: 150,
    right: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Theme.bgCard,
    borderWidth: 1,
    borderColor: Theme.border,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Theme.textPrimary,
    letterSpacing: -0.3,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: Theme.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  headerBadgeText: {
    fontSize: 12,
    color: Theme.textMuted,
  },

  // Progress Card
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: Theme.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  progressCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  progressCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  remainingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Theme.emerald}15`,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.emerald,
    marginLeft: 6,
  },
  progressContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressRingContainer: {
    marginRight: 24,
  },
  progressTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  progressCalories: {
    fontSize: 28,
    fontWeight: "300",
    color: Theme.textPrimary,
    letterSpacing: -1,
  },
  progressLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: -2,
  },
  macrosContainer: {
    flex: 1,
    gap: 12,
  },

  // Macro Bar
  macroBarContainer: {},
  macroBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  macroBarLabelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroBarIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  macroBarLabel: {
    fontSize: 13,
    color: Theme.textSecondary,
  },
  macroBarValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  macroBarGoal: {
    color: Theme.textMuted,
    fontWeight: "400",
  },
  macroBarTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  macroBarFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Meal Type Selector
  mealTypeContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: Theme.textMuted,
    marginBottom: 12,
  },
  mealTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealTypeButton: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Theme.bgCard,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    minWidth: (screenWidth - 60) / 4,
    position: "relative",
  },
  mealTypeButtonActive: {
    backgroundColor: Theme.bgCardHover,
    borderColor: Theme.border,
  },
  mealTypeEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  mealTypeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Theme.textMuted,
  },
  mealTypeLabelActive: {
    color: Theme.textPrimary,
  },
  mealTypeIndicator: {
    position: "absolute",
    bottom: -1,
    left: "25%",
    right: "25%",
    height: 3,
    borderRadius: 2,
  },

  // Input Section
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  inputCard: {
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.borderLight,
    marginBottom: 16,
  },
  inputCardFocused: {
    borderColor: Theme.emerald,
    backgroundColor: Theme.bgCardHover,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Theme.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearBtn: {
    padding: 4,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickActionBtn: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Theme.textMuted,
  },

  // Suggestions
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: Theme.bgCard,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: "500",
    color: Theme.textSecondary,
  },

  // Section
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: "500",
    color: Theme.emerald,
  },

  // Recent Meals
  recentMealsScroll: {
    paddingRight: 20,
  },
  recentMealCard: {
    width: 150,
    height: 180,
    marginRight: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  recentMealContent: {
    flex: 1,
    position: "relative",
  },
  recentMealImage: {
    width: "100%",
    height: "100%",
  },
  recentMealGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    paddingTop: 40,
  },
  recentMealInfo: {},
  recentMealName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  recentMealCalories: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  recentMealBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  recentMealEmoji: {
    fontSize: 16,
  },
  quickAddBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Theme.emerald,
    justifyContent: "center",
    alignItems: "center",
  },

  // Scanner Section
  scannerSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Theme.bgCard,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.border,
  },
  scannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  scannerHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  scannerStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.textMuted,
    marginRight: 10,
  },
  scannerStatusDotScanning: {
    backgroundColor: Theme.cyan,
  },
  scannerStatusDotAnalyzing: {
    backgroundColor: Theme.amber,
  },
  scannerStatusDotComplete: {
    backgroundColor: Theme.emerald,
  },
  scannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.textSecondary,
    letterSpacing: 0.5,
  },
  scannerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.bgCardHover,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerImageContainer: {
    position: "relative",
    height: 260,
    backgroundColor: "#000",
  },
  scannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    zIndex: 10,
  },
  scanLineGradient: {
    flex: 1,
  },
  scanGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 80,
    zIndex: 5,
  },
  scanGlowGradient: {
    flex: 1,
  },
  flickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${Theme.cyan}20`,
  },
  cornerBracket: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: Theme.cyan,
    borderWidth: 2,
  },
  cornerTL: { top: 14, left: 14, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 14, right: 14, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 14, left: 14, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 14, right: 14, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  regionMarker: {
    position: "absolute",
    zIndex: 20,
  },
  markerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.cyan,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerCircleHighlighted: {
    backgroundColor: Theme.emerald,
    transform: [{ scale: 1.1 }],
  },
  markerNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  markerLabel: {
    position: "absolute",
    top: 36,
    left: -45,
    width: 120,
    backgroundColor: Theme.bgPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Theme.cyan,
  },
  markerLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.textPrimary,
    textAlign: "center",
  },
  markerLabelCalories: {
    fontSize: 11,
    color: Theme.cyan,
    textAlign: "center",
    marginTop: 2,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 12, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.textPrimary,
    marginTop: 16,
  },
  analyzingSubtext: {
    fontSize: 13,
    color: Theme.textMuted,
    marginTop: 4,
  },
  progressBarContainer: {
    padding: 16,
  },
  progressBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressBarLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Theme.cyan,
    letterSpacing: 2,
  },
  progressBarPercent: {
    fontSize: 10,
    fontWeight: "700",
    color: Theme.cyan,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: Theme.bgCardHover,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  analysisResults: {
    padding: 20,
  },
  analysisSummary: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  summaryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${Theme.emerald}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Theme.textPrimary,
    marginBottom: 4,
  },
  summaryMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryMetaText: {
    fontSize: 12,
    color: Theme.textMuted,
  },
  summaryMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Theme.textMuted,
    marginHorizontal: 8,
  },
  totalNutrition: {
    flexDirection: "row",
    backgroundColor: Theme.bgCardHover,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  nutritionItem: {
    flex: 1,
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  nutritionLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 4,
  },
  nutritionDivider: {
    width: 1,
    backgroundColor: Theme.border,
    marginVertical: 4,
  },
  detectedItemsList: {
    marginBottom: 20,
  },
  detectedItemsTitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: Theme.textMuted,
    marginBottom: 12,
  },
  detectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  detectedItemHighlighted: {
    backgroundColor: `${Theme.cyan}10`,
    borderColor: Theme.cyan,
  },
  detectedItemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.cyan,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  detectedItemNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  detectedItemInfo: {
    flex: 1,
  },
  detectedItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  detectedItemDesc: {
    fontSize: 12,
    color: Theme.textMuted,
    marginTop: 2,
  },
  detectedItemCalories: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.cyan,
  },
  scannerActions: {
    flexDirection: "row",
    gap: 12,
  },
  rescanBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: `${Theme.cyan}15`,
    borderWidth: 1,
    borderColor: `${Theme.cyan}30`,
  },
  rescanBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.cyan,
    marginLeft: 8,
  },
  logMealBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  logMealBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  logMealBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginRight: 8,
  },
  errorContainer: {
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: Theme.red,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: `${Theme.red}15`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Theme.red}30`,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.red,
  },

  // Floating Button
  floatingButtonContainer: {
    position: "absolute",
    bottom: 34,
    left: 20,
    right: 20,
  },
  floatingButton: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: Theme.emerald,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  floatingButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  floatingButtonArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});

export default FoodAnalysisScreen;