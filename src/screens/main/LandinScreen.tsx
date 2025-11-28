import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import {
  fetchMealPlan,
  fetchMealPlanSimple,
} from "@/redux/slice/mealPlanSlice";
import { fetchUserById } from "@/redux/slice/auth/authSlice";
import { Colors } from "@/constants/Colors";
import Logo from "@/components/ui/Logo";
import { styles } from "../styles/LandingScreenStyles";
import { useMealTime } from "@/types/hooks";
import SpeechBubbleBackground from "@/components/ui/SpeechBubbleBackground";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { mapGender } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BlurView } from "expo-blur";
import * as Progress from "react-native-progress";
import { AnimatedTextInline } from "@/components/ui/AnimatedTextInline";
import * as ImagePicker from "expo-image-picker";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ==================== TYPES ====================
interface Ingredient {
  id: number;
  name: string;
  brand?: string;
  quantity: number;
  unit: string;
  packageSize?: string;
  category: string;
  confidence?: number;
  notes?: string;
}

// ==================== CONSTANTS ====================
const CATEGORIES = [
  "Dairy",
  "Vegetables",
  "Fruits",
  "Meat",
  "Seafood",
  "Beverages",
  "Snacks",
  "Condiments",
  "Grains",
  "Frozen",
  "Canned",
  "Bakery",
  "Spices",
  "Oils",
  "Legumes",
  "Nuts",
  "Other",
];

const UNITS = [
  "pieces",
  "grams",
  "kg",
  "oz",
  "lbs",
  "cups",
  "tbsp",
  "tsp",
  "bottles",
  "cans",
  "packages",
  "bunches",
  "loaves",
  "cartons",
  "jars",
  "boxes",
  "liters",
  "ml",
];

const LandingScreen: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showProgress, setShowProgress] = React.useState(false);
  const [isInputExpanded, setIsInputExpanded] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  // ===== COOK WITH INGREDIENTS STATE =====
  const [showCookWithIngredients, setShowCookWithIngredients] = React.useState(false);
  const [cookStep, setCookStep] = React.useState<"upload" | "scanning" | "inventory" | "confirming">("upload");
  const [ingredientImageUri, setIngredientImageUri] = React.useState<string | null>(null);
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const [editingItem, setEditingItem] = React.useState<Ingredient | null>(null);
  const [scanProgress, setScanProgress] = React.useState(0);
  const [showAddIngredientModal, setShowAddIngredientModal] = React.useState(false);
  const [additionalNotes, setAdditionalNotes] = React.useState("");
  const [newIngredient, setNewIngredient] = React.useState<Partial<Ingredient>>({
    name: "",
    quantity: 1,
    unit: "pieces",
    category: "Other",
  });
  const cookFadeAnim = useRef(new Animated.Value(0)).current;
  const cookSlideAnim = useRef(new Animated.Value(50)).current;

  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { assessment, targetCalories } = route.params || {};
  const user = useAppSelector((state) => state.auth.user);
  const { healthCondition } = useAppSelector((state) => state.auth);
  const { immuneDisorder } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.mealPlan);
  const { currentMealType, mealImage } = useMealTime();
  const [processingType, setProcessingType] = React.useState<
    "suggest" | "surprise" | null
  >(null);

  console.log(user);
  // ✅ Fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (user?.userId) dispatch(fetchUserById(user.userId));
  }, [dispatch, user?.userId]);

  // Animation for Cook With Ingredients modal
  useEffect(() => {
    if (showCookWithIngredients) {
      Animated.parallel([
        Animated.timing(cookFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cookSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      cookFadeAnim.setValue(0);
      cookSlideAnim.setValue(50);
    }
  }, [showCookWithIngredients]);

  const ethnicityMap = {
    Hispanic: "Hispanic or Latino",
    Latino: "Hispanic or Latino",
    "African American": "Black or African American",
    Black: "Black or African American",
    Asian: "Asian",
    White: "White",
    "Prefer not to say": "Prefer not to say",
  };

  const activityLevels = [
    { id: "NOT_ACTIVE", label: "Not Active" },
    { id: "SOMEWHAT_ACTIVE", label: "Somewhat Active" },
    { id: "ACTIVE", label: "Active" },
    { id: "VERY_ACTIVE", label: "Very Active" },
    { id: "EXTRA_ACTIVE", label: "Athletic" },
    { id: "PRO_ATHLETE", label: "Pro Athlete" },
  ];

  const mappedActivity =
    activityLevels.find((a) => a.id === user?.activityLevel)?.label || "Active";

  const goToDashboard = async (type: "suggest" | "surprise") => {
    try {
      setProcessingType(type);
      setIsProcessing(true);
      setShowProgress(false);

      setTimeout(async () => {
        setShowProgress(true);
        await handleMealPlanRequest(type);
      }, 1500);
    } catch (error) {
      console.error("❌ Meal Plan Fetch Error:", error);
    }
  };

  const handleMealPlanRequest = async (type: "suggest" | "surprise") => {
    let ethnicity = "Asian";

    if (
      type === "suggest" &&
      (!ethnicity || ethnicity === "Prefer not to say")
    ) {
      ethnicity = "Asian";
    }

    const weightLbs = user?.weightInLbs ?? 180;
    const heightFeet = user?.heightInFeet ?? 5;
    const heightInches = user?.heightInInches ?? 0;
    const targetWeightLbs = user?.targetWeight ?? 180;

    const effectiveCalories = Math.round(
      targetCalories ?? user?.targetCalories ?? 1800
    );

    const basePayload = {
      plan_type: "daily",
      user_profile: {
        birth_year: user?.birthYear ?? 1990,
        birth_month: user?.birthMonth ?? 6,
        weight_lbs: weightLbs,
        height_feet: heightFeet,
        height_inches: heightInches,
        biological_sex: mapGender(user?.gender),
        food_preference: user?.dietPreference ?? "Non-Veg",
        on_diet_plan: user?.isOnDiet ?? false,
        activity_level: mappedActivity,
        travel_frequency: user?.travelPercentage ?? "Rarely/Never",
        ethnicity,
      },
      health_conditions: {
        diabetes_type1_type2:
          healthCondition?.diabetes_type1_type2 ??
          healthCondition?.diabetes ??
          healthCondition?.preDiabetes ??
          false,
        hypertension: healthCondition?.hypertension ?? false,
        cancer: healthCondition?.cancer ?? false,
        immune_disorder: healthCondition?.immune_disorder ?? false,
        neurological_health: healthCondition?.neurological_health ?? false,
        food_allergies: healthCondition?.food_allergies ?? [],
      },
      user_goal: {
        weight_goal:
          user?.goal === "LOSE"
            ? "lose"
            : user?.goal === "GAIN"
            ? "gain"
            : "maintain",
        target_weight_lbs: targetWeightLbs,
        target_calories: effectiveCalories,
      },
      options_per_meal: 1,
      include_recipes: true,
      recipe_detail_level: "detailed",
      target_date: new Date().toISOString().split("T")[0],
    };

    const finalPayload =
      query.trim().length > 0
        ? { ...basePayload, prompt: query.trim() }
        : { ...basePayload, target_daily_calories: effectiveCalories };

    if (query.trim().length > 0) {
      await dispatch(fetchMealPlan(finalPayload));
    } else {
      await dispatch(fetchMealPlanSimple(finalPayload));
    }

    navigation.navigate("Dashboard", {
      mealType: currentMealType,
      surpriseMode: type === "surprise",
      fromLanding: true,
    });

    // Reset animation state
    setIsProcessing(false);
    setShowProgress(false);
  };

  const handleProfilePress = () => navigation.navigate("Profile");
  const handleMorePress = () =>
    navigation.navigate("AllScreensMenu", { from: "LandingScreen" });

  // ===== MIC AND TUNE HANDLERS =====
  const handleMicPress = async () => {
    // TODO: Implement voice recognition
    // You can use expo-speech or react-native-voice for speech-to-text
    // For now, show an alert that this feature is coming
    Alert.alert(
      "Voice Input",
      "Voice input feature coming soon! You can type your meal preferences for now.",
      [{ text: "OK" }]
    );

    // Example implementation with expo-speech or react-native-voice:
    // try {
    //   const result = await Voice.start('en-US');
    //   // Handle voice recognition result
    //   Voice.onSpeechResults = (e) => {
    //     if (e.value && e.value[0]) {
    //       setQuery(e.value[0]);
    //     }
    //   };
    // } catch (error) {
    //   console.error('Voice recognition error:', error);
    // }
  };

  const handleTunePress = () => {
    // Navigate to preferences/settings or show filter options
    navigation.navigate("MealPreferences");
    // Or you can show a modal with filter options:
    // setShowFilterModal(true);
  };

  // ===== COOK WITH INGREDIENTS HANDLERS =====
  const handleCookWithIngredients = () => {
    setShowCookWithIngredients(true);
    setCookStep("upload");
    setIngredientImageUri(null);
    setIngredients([]);
    setEditingItem(null);
    setScanProgress(0);
    setAdditionalNotes("");
  };

  const closeCookWithIngredients = () => {
    setShowCookWithIngredients(false);
    setCookStep("upload");
    setIngredientImageUri(null);
    setIngredients([]);
    setEditingItem(null);
    setScanProgress(0);
    setAdditionalNotes("");
  };

  // ===== IMAGE PICKER =====
  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please allow access to your photo library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setIngredientImageUri(result.assets[0].uri);
        processIngredientImage(result.assets[0].base64 || "");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takeIngredientPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please allow access to your camera.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setIngredientImageUri(result.assets[0].uri);
        processIngredientImage(result.assets[0].base64 || "");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  // ===== AI IMAGE PROCESSING =====
  const processIngredientImage = async (base64Image: string) => {
    setCookStep("scanning");
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // TODO: Replace with actual AI API call (e.g., Google Vision, Clarifai, or custom backend)
      await simulateAIDetection(base64Image);

      clearInterval(progressInterval);
      setScanProgress(100);

      setTimeout(() => {
        setCookStep("inventory");
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to analyze image. Please try again.");
      setCookStep("upload");
    }
  };

  // Mock AI detection - Replace with actual API call
  const simulateAIDetection = async (base64Image: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockIngredients: Ingredient[] = [
          { id: 1, name: "Tomatoes", quantity: 4, unit: "pieces", category: "Vegetables", confidence: 95 },
          { id: 2, name: "Onion", quantity: 2, unit: "pieces", category: "Vegetables", confidence: 92 },
          { id: 3, name: "Garlic", quantity: 1, unit: "pieces", category: "Vegetables", confidence: 88 },
          { id: 4, name: "Chicken Breast", quantity: 500, unit: "grams", category: "Meat", confidence: 90 },
          { id: 5, name: "Olive Oil", quantity: 1, unit: "bottles", category: "Oils", confidence: 85 },
          { id: 6, name: "Bell Pepper", quantity: 2, unit: "pieces", category: "Vegetables", confidence: 87 },
          { id: 7, name: "Rice", quantity: 1, unit: "kg", category: "Grains", confidence: 91 },
        ];
        setIngredients(mockIngredients);
        resolve();
      }, 2000);
    });
  };

  // ===== INGREDIENT MANAGEMENT =====
  const handleEditIngredient = (item: Ingredient) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    setIngredients((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const handleDeleteIngredient = (id: number) => {
    Alert.alert(
      "Delete Ingredient",
      "Are you sure you want to remove this ingredient?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setIngredients((prev) => prev.filter((item) => item.id !== id)),
        },
      ]
    );
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name?.trim()) {
      Alert.alert("Error", "Please enter an ingredient name.");
      return;
    }

    const ingredient: Ingredient = {
      id: Math.max(...ingredients.map((i) => i.id), 0) + 1,
      name: newIngredient.name.trim(),
      brand: newIngredient.brand,
      quantity: newIngredient.quantity || 1,
      unit: newIngredient.unit || "pieces",
      packageSize: newIngredient.packageSize,
      category: newIngredient.category || "Other",
      confidence: 100,
      notes: newIngredient.notes,
    };

    setIngredients((prev) => [...prev, ingredient]);
    setNewIngredient({ name: "", quantity: 1, unit: "pieces", category: "Other" });
    setShowAddIngredientModal(false);
  };

  // ===== MEAL SUGGESTION WITH INGREDIENTS =====
  const handleConfirmAndSuggestMeal = async () => {
    if (ingredients.length === 0) {
      Alert.alert("No Ingredients", "Please add at least one ingredient.");
      return;
    }

    setCookStep("confirming");

    try {
      const ingredientsList = ingredients.map((i) => `${i.quantity} ${i.unit} ${i.name}`).join(", ");

      const effectiveCalories = Math.round(
        targetCalories ?? user?.targetCalories ?? 1800
      );

      const payload = {
        plan_type: "daily",
        user_profile: {
          birth_year: user?.birthYear ?? 1990,
          birth_month: user?.birthMonth ?? 6,
          weight_lbs: user?.weightInLbs ?? 180,
          height_feet: user?.heightInFeet ?? 5,
          height_inches: user?.heightInInches ?? 0,
          biological_sex: mapGender(user?.gender),
          food_preference: user?.dietPreference ?? "Non-Veg",
          on_diet_plan: user?.isOnDiet ?? false,
          activity_level: mappedActivity,
          travel_frequency: user?.travelPercentage ?? "Rarely/Never",
          ethnicity: "Asian",
        },
        health_conditions: {
          diabetes_type1_type2:
            healthCondition?.diabetes_type1_type2 ??
            healthCondition?.diabetes ??
            healthCondition?.preDiabetes ??
            false,
          hypertension: healthCondition?.hypertension ?? false,
          cancer: healthCondition?.cancer ?? false,
          immune_disorder: healthCondition?.immune_disorder ?? false,
          neurological_health: healthCondition?.neurological_health ?? false,
          food_allergies: healthCondition?.food_allergies ?? [],
        },
        user_goal: {
          weight_goal:
            user?.goal === "LOSE"
              ? "lose"
              : user?.goal === "GAIN"
              ? "gain"
              : "maintain",
          target_weight_lbs: user?.targetWeight ?? 180,
          target_calories: effectiveCalories,
        },
        options_per_meal: 1,
        include_recipes: true,
        recipe_detail_level: "detailed",
        target_date: new Date().toISOString().split("T")[0],
        prompt: `Create a meal using ONLY these available ingredients: ${ingredientsList}. ${additionalNotes ? `Additional preferences: ${additionalNotes}` : ""}`,
        cook_with_ingredients: true,
        available_ingredients: ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          category: i.category,
        })),
      };

      await dispatch(fetchMealPlan(payload));

      setShowCookWithIngredients(false);

      navigation.navigate("Dashboard", {
        mealType: currentMealType,
        surpriseMode: false,
        fromCookWithIngredients: true,
        usedIngredients: ingredients,
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      Alert.alert("Error", "Failed to generate meal suggestions. Please try again.");
      setCookStep("inventory");
    }
  };

  // ===== GROUP INGREDIENTS BY CATEGORY =====
  const ingredientsByCategory = ingredients.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const handleInputPress = () => {
    setIsInputExpanded(true);
    Animated.spring(expandAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCloseExpandedInput = () => {
    Animated.timing(expandAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsInputExpanded(false);
    });
  };

  const handleExpandedSubmit = () => {
    handleCloseExpandedInput();
    if (query.trim().length > 0) {
      goToDashboard("suggest");
    }
  };

  // ===== RENDER COOK WITH INGREDIENTS STEPS =====
  const renderUploadStep = () => (
    <Animated.View
      style={[
        localStyles.cookContentContainer,
        { opacity: cookFadeAnim, transform: [{ translateY: cookSlideAnim }] },
      ]}
    >
      <View style={localStyles.cookHeaderSection}>
        <MaterialCommunityIcons name="food-variant" size={48} color={Colors.primaryYellow} />
        <Text style={localStyles.cookTitle}>Cook with My Ingredients</Text>
        <Text style={localStyles.cookSubtitle}>
          Scan your groceries or ingredients, and we'll suggest delicious meals you can make!
        </Text>
      </View>

      <View style={localStyles.uploadOptionsContainer}>
        <TouchableOpacity style={localStyles.uploadOption} onPress={takeIngredientPhoto} activeOpacity={0.8}>
          <View style={localStyles.uploadIconContainer}>
            <Ionicons name="camera" size={28} color="#fff" />
          </View>
          <Text style={localStyles.uploadOptionTitle}>Take Photo</Text>
          <Text style={localStyles.uploadOptionSubtitle}>Snap a picture of your ingredients</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.uploadOption} onPress={pickImageFromGallery} activeOpacity={0.8}>
          <View style={[localStyles.uploadIconContainer, localStyles.uploadIconContainerPurple]}>
            <Ionicons name="images" size={28} color="#fff" />
          </View>
          <Text style={localStyles.uploadOptionTitle}>Choose from Gallery</Text>
          <Text style={localStyles.uploadOptionSubtitle}>Select an existing photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[localStyles.uploadOption, localStyles.manualEntryOption]}
          onPress={() => setCookStep("inventory")}
          activeOpacity={0.8}
        >
          <View style={[localStyles.uploadIconContainer, localStyles.uploadIconContainerGreen]}>
            <MaterialCommunityIcons name="pencil-plus" size={28} color="#fff" />
          </View>
          <Text style={localStyles.uploadOptionTitle}>Enter Manually</Text>
          <Text style={localStyles.uploadOptionSubtitle}>Type your ingredients one by one</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderScanningStep = () => (
    <View style={localStyles.scanningContainer}>
      {ingredientImageUri && (
        <Image source={{ uri: ingredientImageUri }} style={localStyles.scanningImage} resizeMode="cover" />
      )}
      <BlurView intensity={80} tint="dark" style={localStyles.scanningOverlay}>
        <View style={localStyles.scanningContent}>
          <MaterialCommunityIcons name="line-scan" size={64} color={Colors.primaryYellow} />
          <Text style={localStyles.scanningTitle}>Analyzing Your Ingredients...</Text>
          <Text style={localStyles.scanningSubtitle}>
            Our AI is identifying items in your image
          </Text>
          <View style={localStyles.progressContainer}>
            <Progress.Bar
              progress={scanProgress / 100}
              width={SCREEN_WIDTH * 0.6}
              height={8}
              color={Colors.primaryYellow}
              unfilledColor="rgba(255,255,255,0.2)"
              borderWidth={0}
              borderRadius={4}
            />
            <Text style={localStyles.progressText}>{Math.round(scanProgress)}%</Text>
          </View>
        </View>
      </BlurView>
    </View>
  );

  const renderInventoryStep = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={localStyles.inventoryContainer}
    >
      <ScrollView
        style={localStyles.inventoryScroll}
        contentContainerStyle={localStyles.inventoryScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={localStyles.inventoryHeader}>
          <View style={localStyles.inventoryTitleRow}>
            <MaterialCommunityIcons name="basket" size={28} color={Colors.primaryYellow} />
            <Text style={localStyles.inventoryTitle}>
              Your Ingredients ({ingredients.length})
            </Text>
          </View>
          <TouchableOpacity
            style={localStyles.addButton}
            onPress={() => setShowAddIngredientModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={localStyles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {ingredientImageUri && (
          <View style={localStyles.imagePreviewContainer}>
            <Image source={{ uri: ingredientImageUri }} style={localStyles.imagePreview} resizeMode="cover" />
            <TouchableOpacity
              style={localStyles.rescanButton}
              onPress={() => {
                setIngredientImageUri(null);
                setIngredients([]);
                setCookStep("upload");
              }}
            >
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={localStyles.rescanButtonText}>Rescan</Text>
            </TouchableOpacity>
          </View>
        )}

        {Object.entries(ingredientsByCategory).map(([category, items]) => (
          <View key={category} style={localStyles.categorySection}>
            <Text style={localStyles.categoryTitle}>
              {category} ({items.length})
            </Text>
            {items.map((item) => (
              <View key={item.id}>
                {editingItem?.id === item.id ? (
                  <View style={localStyles.editItemContainer}>
                    <View style={localStyles.editRow}>
                      <View style={localStyles.editField}>
                        <Text style={localStyles.editLabel}>Name</Text>
                        <TextInput
                          style={localStyles.editInput}
                          value={editingItem.name}
                          onChangeText={(text) =>
                            setEditingItem({ ...editingItem, name: text })
                          }
                          placeholder="Ingredient name"
                          placeholderTextColor="rgba(0,0,0,0.4)"
                        />
                      </View>
                      <View style={[localStyles.editField, { flex: 0.5 }]}>
                        <Text style={localStyles.editLabel}>Qty</Text>
                        <TextInput
                          style={localStyles.editInput}
                          value={String(editingItem.quantity)}
                          onChangeText={(text) =>
                            setEditingItem({
                              ...editingItem,
                              quantity: parseInt(text) || 0,
                            })
                          }
                          keyboardType="numeric"
                          placeholder="1"
                        />
                      </View>
                    </View>
                    <View style={localStyles.editRow}>
                      <View style={localStyles.editField}>
                        <Text style={localStyles.editLabel}>Unit</Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={localStyles.unitSelector}
                        >
                          {UNITS.slice(0, 8).map((unit) => (
                            <TouchableOpacity
                              key={unit}
                              style={[
                                localStyles.unitChip,
                                editingItem.unit === unit && localStyles.unitChipActive,
                              ]}
                              onPress={() => setEditingItem({ ...editingItem, unit })}
                            >
                              <Text
                                style={[
                                  localStyles.unitChipText,
                                  editingItem.unit === unit && localStyles.unitChipTextActive,
                                ]}
                              >
                                {unit}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                    <View style={localStyles.editActions}>
                      <TouchableOpacity
                        style={localStyles.saveEditButton}
                        onPress={handleSaveEdit}
                      >
                        <Ionicons name="checkmark" size={18} color="#fff" />
                        <Text style={localStyles.saveEditButtonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={localStyles.cancelEditButton}
                        onPress={() => setEditingItem(null)}
                      >
                        <Ionicons name="close" size={18} color="#666" />
                        <Text style={localStyles.cancelEditButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={localStyles.ingredientItem}>
                    <View style={localStyles.ingredientInfo}>
                      <Text style={localStyles.ingredientName}>
                        {item.quantity} {item.unit} {item.name}
                      </Text>
                      {item.confidence && item.confidence < 100 && (
                        <View style={localStyles.confidenceBadge}>
                          <Text style={localStyles.confidenceText}>
                            {item.confidence}% match
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={localStyles.ingredientActions}>
                      <TouchableOpacity
                        style={[localStyles.actionButton, localStyles.actionButtonEdit]}
                        onPress={() => handleEditIngredient(item)}
                      >
                        <Feather name="edit-2" size={16} color="#60A5FA" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[localStyles.actionButton, localStyles.actionButtonDelete]}
                        onPress={() => handleDeleteIngredient(item.id)}
                      >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        {ingredients.length === 0 && (
          <View style={localStyles.emptyState}>
            <MaterialCommunityIcons
              name="food-off"
              size={64}
              color="rgba(255,255,255,0.3)"
            />
            <Text style={localStyles.emptyStateText}>No ingredients yet</Text>
            <Text style={localStyles.emptyStateSubtext}>
              Tap "Add" to manually enter ingredients
            </Text>
          </View>
        )}

        <View style={localStyles.notesSection}>
          <Text style={localStyles.notesLabel}>Additional Preferences (Optional)</Text>
          <TextInput
            style={localStyles.notesInput}
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder="E.g., 'Quick meal under 30 mins', 'Low carb', 'Kid-friendly'..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[
            localStyles.confirmButton,
            ingredients.length === 0 && localStyles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmAndSuggestMeal}
          disabled={ingredients.length === 0 || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#333" />
              <Text style={localStyles.confirmButtonText}>
                Suggest Meals ({ingredients.length} ingredients)
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderConfirmingStep = () => (
    <View style={localStyles.confirmingContainer}>
      <View style={localStyles.confirmingContent}>
        <MaterialCommunityIcons name="chef-hat" size={72} color={Colors.primaryYellow} />
        <Text style={localStyles.confirmingTitle}>Creating Your Perfect Meal...</Text>
        <Text style={localStyles.confirmingSubtitle}>
          Our AI chef is crafting personalized recipes with your {ingredients.length} ingredients
        </Text>
        <Progress.Bar
          indeterminate
          width={SCREEN_WIDTH * 0.6}
          height={6}
          color={Colors.primaryYellow}
          unfilledColor="rgba(255,255,255,0.2)"
          borderWidth={0}
          borderRadius={3}
          style={{ marginTop: 24 }}
        />
      </View>
    </View>
  );

  // ===== ADD INGREDIENT MODAL =====
  const renderAddIngredientModal = () => (
    <Modal
      visible={showAddIngredientModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAddIngredientModal(false)}
    >
      <View style={localStyles.modalOverlay}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} />
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={() => setShowAddIngredientModal(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={localStyles.modalWrapper}
        >
          <View style={localStyles.modalContent}>
            <TouchableOpacity
              style={localStyles.modalCloseButton}
              onPress={() => setShowAddIngredientModal(false)}
            >
              <Ionicons name="close" size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            <Text style={localStyles.modalTitle}>Add Ingredient</Text>

            <View style={localStyles.modalField}>
              <Text style={localStyles.modalLabel}>Name *</Text>
              <TextInput
                style={localStyles.modalInput}
                value={newIngredient.name}
                onChangeText={(text) => setNewIngredient({ ...newIngredient, name: text })}
                placeholder="e.g., Tomatoes, Chicken, Rice..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoFocus
              />
            </View>

            <View style={localStyles.modalRow}>
              <View style={[localStyles.modalField, { flex: 1 }]}>
                <Text style={localStyles.modalLabel}>Quantity</Text>
                <TextInput
                  style={localStyles.modalInput}
                  value={String(newIngredient.quantity || "")}
                  onChangeText={(text) =>
                    setNewIngredient({ ...newIngredient, quantity: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
              </View>
              <View style={[localStyles.modalField, { flex: 1.5, marginLeft: 12 }]}>
                <Text style={localStyles.modalLabel}>Unit</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {UNITS.slice(0, 6).map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        localStyles.unitChipModal,
                        newIngredient.unit === unit && localStyles.unitChipModalActive,
                      ]}
                      onPress={() => setNewIngredient({ ...newIngredient, unit })}
                    >
                      <Text
                        style={[
                          localStyles.unitChipModalText,
                          newIngredient.unit === unit && localStyles.unitChipModalTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={localStyles.modalField}>
              <Text style={localStyles.modalLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      localStyles.categoryChip,
                      newIngredient.category === cat && localStyles.categoryChipActive,
                    ]}
                    onPress={() => setNewIngredient({ ...newIngredient, category: cat })}
                  >
                    <Text
                      style={[
                        localStyles.categoryChipText,
                        newIngredient.category === cat && localStyles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[
                localStyles.modalAddButton,
                !newIngredient.name?.trim() && localStyles.modalAddButtonDisabled,
              ]}
              onPress={handleAddIngredient}
              disabled={!newIngredient.name?.trim()}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color={newIngredient.name?.trim() ? "#333" : "#999"} />
              <Text
                style={[
                  localStyles.modalAddButtonText,
                  !newIngredient.name?.trim() && localStyles.modalAddButtonTextDisabled,
                ]}
              >
                Add Ingredient
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  return (
    <ImageBackground
      source={mealImage}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <BlurView
        intensity={25}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />

      <LoadingSpinner
        visible={loading && !isProcessing && !showCookWithIngredients}
        message="Fetching your personalized meal plan..."
      />

      <Animated.View
        style={{
          opacity: fadeAnim,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: Platform.OS === "ios" ? 50 : 40,
          left: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleProfilePress}
          style={localStyles.circleBtn}
        />
        <TouchableOpacity onPress={handleMorePress} style={localStyles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.mainContent}>
          <Logo />

          <View style={styles.topSection}>
            <Animated.View
              style={[styles.speechBubbleContainer, { opacity: fadeAnim }]}
            >
            <SpeechBubbleBackground>
              <ScrollView
                style={localStyles.speechBubbleScroll}
                contentContainerStyle={localStyles.speechBubbleScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <View style={styles.greetingRow}>
                  <Image
                    source={require("assets/Ellipse 161.png")}
                    style={styles.profileImage}
                  />
                  <View style={styles.greetingTextContainer}>
                    <Text style={styles.greeting} numberOfLines={2}>
                      Hello, {user.firstName || "vella"}!
                    </Text>
                    <Text style={styles.subGreeting} numberOfLines={2}>
                      It's {currentMealType} time!
                    </Text>
                  </View>
                </View>

                <View style={styles.blackDivider} />

              {!isProcessing ? (
                <>
                  {/* Tappable Input Placeholder */}
                  <View style={localStyles.inputPlaceholder}>
                    <TouchableOpacity
                      style={localStyles.inputTextArea}
                      onPress={handleInputPress}
                      activeOpacity={0.8}
                    >
                      <Text style={localStyles.inputPlaceholderText}>
                        {query.trim().length > 0 ? query : "Fancy a meal? Ask AI"}
                      </Text>
                    </TouchableOpacity>
                    <View style={localStyles.inputPlaceholderIcons}>
                      <TouchableOpacity onPress={handleMicPress} activeOpacity={0.7}>
                        <Ionicons name="mic-outline" size={20} color="rgba(0,0,0,0.4)" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleTunePress} activeOpacity={0.7}>
                        <MaterialCommunityIcons name="tune-variant" size={20} color="rgba(0,0,0,0.4)" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.yellowBtn}
                      onPress={() => goToDashboard("suggest")}
                      disabled={loading}
                    >
                      <Text style={styles.yellowBtnText}>Suggest Meal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.yellowBtn,
                        (query.trim().length > 0 || loading) && {
                          opacity: 0.5,
                        },
                      ]}
                      onPress={() => goToDashboard("surprise")}
                      disabled={query.trim().length > 0 || loading}
                    >
                      <Text style={styles.yellowBtnText}>Surprise Meal</Text>
                    </TouchableOpacity>
                  </View>

                  {/* OR Divider */}
                  <View style={localStyles.orDivider}>
                    <View style={localStyles.orLine} />
                    <Text style={localStyles.orText}>OR</Text>
                    <View style={localStyles.orLine} />
                  </View>

                  {/* Cook with My Ingredients Button - Same style as speech bubble */}
                  <TouchableOpacity
                    style={localStyles.cookIngredientsBtn}
                    onPress={handleCookWithIngredients}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="text-box-search-outline"
                      size={20}
                      color="#4A4A4A"
                    />
                    <Text style={localStyles.cookIngredientsText}>
                      Cook with My Ingredients
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={localStyles.messageContainer}>
                  <View style={{ maxWidth: "100%" }}>
                    <AnimatedTextInline
                      style={localStyles.processingTextTitle}
                      numberOfLines={1}
                    >
                      {processingType === "surprise"
                        ? "We're cooking up something new!"
                        : "Craving for your preferred meals"}
                    </AnimatedTextInline>
                  </View>

                  <AnimatedTextInline
                    style={localStyles.processingTextDesc}
                    duration={800}
                  >
                    {processingType === "surprise"
                      ? "This meal plan is based on your customized goals, but it may include cuisines outside your usual preferences, like South Asian, Italian, or other surprises!"
                      : "This meal plan is based on your customized goals, but it may include cuisines based on your usual preferences"}
                  </AnimatedTextInline>

                  {showProgress && (
                    <Progress.Bar
                      indeterminate
                      animationType="timing"
                      width={180}
                      unfilledColor="#E5E5E5"
                      borderColor="#E5E5E5"
                      borderWidth={0}
                      style={{ marginTop: 20 }}
                    />
                  )}
                </View>
              )}
              </ScrollView>
            </SpeechBubbleBackground>
          </Animated.View>
        </View>
      </View>
      </KeyboardAvoidingView>

      {/* Expanded Input Overlay - Matches Cook With Ingredients Style */}
      {isInputExpanded && (
        <View style={localStyles.expandedOverlay}>
          <BlurView
            intensity={100}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />

          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={handleCloseExpandedInput}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={localStyles.expandedCenterWrapper}
          >
            <Animated.View
              style={[
                localStyles.expandedCard,
                {
                  opacity: expandAnim,
                  transform: [
                    {
                      scale: expandAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity
                style={localStyles.expandedCloseBtn}
                onPress={handleCloseExpandedInput}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>

              {/* Title */}
              <Text style={localStyles.expandedTitle}>What are you craving?</Text>

              {/* Input Container */}
              <View style={localStyles.expandedInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={localStyles.expandedInput}
                  placeholder="Describe your perfect meal..."
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={query}
                  onChangeText={setQuery}
                  multiline
                  autoFocus
                  textAlignVertical="top"
                />

                {/* Input Actions */}
                <View style={localStyles.expandedInputActions}>
                  <TouchableOpacity onPress={handleMicPress} activeOpacity={0.7}>
                    <Ionicons name="mic-outline" size={22} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleTunePress} activeOpacity={0.7}>
                    <MaterialCommunityIcons name="tune-variant" size={22} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Buttons */}
              <View style={localStyles.expandedButtonRow}>
                <TouchableOpacity
                  style={[
                    localStyles.expandedYellowBtn,
                    query.trim().length === 0 && localStyles.expandedYellowBtnDisabled,
                  ]}
                  onPress={handleExpandedSubmit}
                  disabled={query.trim().length === 0}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    localStyles.expandedYellowBtnText,
                    query.trim().length === 0 && localStyles.expandedYellowBtnTextDisabled,
                  ]}>
                    Suggest Meal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    localStyles.expandedYellowBtn,
                    (query.trim().length > 0 || loading) && localStyles.expandedYellowBtnDisabled,
                  ]}
                  onPress={() => {
                    handleCloseExpandedInput();
                    goToDashboard("surprise");
                  }}
                  disabled={query.trim().length > 0 || loading}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    localStyles.expandedYellowBtnText,
                    (query.trim().length > 0 || loading) && localStyles.expandedYellowBtnTextDisabled,
                  ]}>
                    Surprise Meal
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      )}

      {/* ===== COOK WITH INGREDIENTS MODAL ===== */}
      <Modal
        visible={showCookWithIngredients}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeCookWithIngredients}
      >
        <ImageBackground
          source={mealImage}
          style={localStyles.cookModalContainer}
          imageStyle={{ opacity: 0.4 }}
        >
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />

          {/* Header */}
          <View style={localStyles.cookHeader}>
            <TouchableOpacity style={localStyles.cookBackButton} onPress={closeCookWithIngredients}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={localStyles.cookHeaderTitle}>
              {cookStep === "upload" && "Add Ingredients"}
              {cookStep === "scanning" && "Scanning..."}
              {cookStep === "inventory" && "Review Ingredients"}
              {cookStep === "confirming" && "Creating Meal..."}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content based on step */}
          {cookStep === "upload" && renderUploadStep()}
          {cookStep === "scanning" && renderScanningStep()}
          {cookStep === "inventory" && renderInventoryStep()}
          {cookStep === "confirming" && renderConfirmingStep()}

          {/* Add Ingredient Modal */}
          {renderAddIngredientModal()}

          {/* Loading Spinner */}
          <LoadingSpinner
            visible={loading && cookStep === "confirming"}
            message="Generating meal suggestions..."
          />
        </ImageBackground>
      </Modal>
    </ImageBackground>
  );
};

const localStyles = StyleSheet.create({
  // ScrollView for speech bubble content
  speechBubbleScroll: {
    maxHeight: 400,
  },
  speechBubbleScrollContent: {
    flexGrow: 1,
  },
  messageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  processingTextTitle: {
    color: Colors.primaryYellow,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  processingTextDesc: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.9,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  moreBtn: {
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
  },
  // OR Divider
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    paddingHorizontal: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  orText: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.35)",
    letterSpacing: 1,
  },
  // Cook with My Ingredients Button
  cookIngredientsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 10,
    gap: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  cookIngredientsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },

  // Input Placeholder (tappable)
  inputPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  inputTextArea: {
    flex: 1,
  },
  inputPlaceholderText: {
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.5)",
  },
  inputPlaceholderIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // Expanded Overlay - Transparent with Blur (matches Cook With Ingredients)
  expandedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  expandedCenterWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  expandedCard: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  expandedCloseBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  expandedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    marginTop: 8,
  },
  expandedInputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  expandedInput: {
    fontSize: 16,
    color: "#fff",
    minHeight: 80,
    maxHeight: 140,
    paddingTop: 4,
    paddingBottom: 8,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  expandedInputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 8,
    gap: 16,
  },
  // Button row in popup - same as main page
  expandedButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  expandedYellowBtn: {
    flex: 1,
    backgroundColor: "#FBBF24",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedYellowBtnDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  expandedYellowBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  expandedYellowBtnTextDisabled: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  expandedActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryYellow,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  expandedSubmitBtnDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  expandedSubmitBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  expandedSubmitBtnTextDisabled: {
    color: "rgba(255, 255, 255, 0.5)",
  },

  // ===== COOK WITH INGREDIENTS STYLES =====
  cookModalContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  cookHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cookBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cookHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },

  // Upload Step
  cookContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cookHeaderSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  cookTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 16,
    textAlign: "center",
  },
  cookSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  uploadOptionsContainer: {
    marginTop: 20,
  },
  uploadOption: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  manualEntryOption: {
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.2)",
  },
  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FBBF24",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadIconContainerPurple: {
    backgroundColor: "#8B5CF6",
  },
  uploadIconContainerGreen: {
    backgroundColor: "#10B981",
  },
  uploadOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  uploadOptionSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },

  // Scanning Step
  scanningContainer: {
    flex: 1,
  },
  scanningImage: {
    width: "100%",
    height: "100%",
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanningContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  scanningTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  scanningSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  progressText: {
    fontSize: 14,
    color: Colors.primaryYellow,
    fontWeight: "600",
    marginTop: 8,
  },

  // Inventory Step
  inventoryContainer: {
    flex: 1,
  },
  inventoryScroll: {
    flex: 1,
  },
  inventoryScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  inventoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inventoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inventoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBBF24",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  // Image Preview
  imagePreviewContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  rescanButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  rescanButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },

  // Category Section
  categorySection: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FBBF24",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Ingredient Item
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  ingredientInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  ingredientName: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  confidenceBadge: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  confidenceText: {
    fontSize: 11,
    color: "#FBBF24",
    fontWeight: "600",
  },
  ingredientActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  actionButtonEdit: {
    backgroundColor: "rgba(96, 165, 250, 0.15)",
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  actionButtonDelete: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },

  // Edit Item
  editItemContainer: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.primaryYellow,
  },
  editRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  editField: {
    flex: 1,
  },
  editLabel: {
    fontSize: 11,
    color: Colors.primaryYellow,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  editInput: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  unitSelector: {
    flexDirection: "row",
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
  },
  unitChipActive: {
    backgroundColor: Colors.primaryYellow,
  },
  unitChipText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  unitChipTextActive: {
    color: "#333",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
  saveEditButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  saveEditButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  cancelEditButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  cancelEditButtonText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
    marginTop: 4,
  },

  // Notes Section
  notesSection: {
    marginTop: 16,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: "#fff",
    minHeight: 90,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    lineHeight: 22,
  },

  // Confirm Button
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBBF24",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.3,
  },

  // Confirming Step
  confirmingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  confirmingContent: {
    alignItems: "center",
  },
  confirmingTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 24,
    textAlign: "center",
  },
  confirmingSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },

  // Modal Styles (Dark Theme)
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: {
    width: "100%",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "rgba(30, 30, 45, 0.95)",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  modalField: {
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: "row",
  },
  modalLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  unitChipModal: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
  },
  unitChipModalActive: {
    backgroundColor: Colors.primaryYellow,
  },
  unitChipModalText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  unitChipModalTextActive: {
    color: "#333",
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#10B981",
  },
  categoryChipText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  modalAddButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryYellow,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  modalAddButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  modalAddButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  modalAddButtonTextDisabled: {
    color: "rgba(255,255,255,0.4)",
  },
});

export default LandingScreen;