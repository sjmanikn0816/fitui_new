// FoodAnalysisScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@/redux/store/hooks";
import { fetchFoodAnalysis } from "@/redux/slice/mealPlanSlice";
import { showModal } from "@/redux/slice/modalSlice";
import { Colors } from "@/constants/Colors";
import ImagePickerSection from "@/components/ui/ImagePickerSection";
import TextInputSection from "@/components/foodanalysis/TextInputSection";
import ResponseLevelSection from "@/components/foodanalysis/ResponseLevelSection";
import AnalyzeButton from "@/components/foodanalysis/AnalyzeButton";
import VoiceSearchSection from "./VoiceSearchSection";
import { styles } from "./Dashboardtabs/styles/FoofAnalysisScreenStyles";


interface FoodAnalysisScreenProps {
  navigation: any;
  route: any;
}

const FoodAnalysisScreen: React.FC<FoodAnalysisScreenProps> = ({
  navigation,
  route,
}) => {
  const [query, setQuery] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseLevel, setResponseLevel] = useState<"quick" | "detailed">("detailed");
  const [inputType, setInputType] = useState<"text" | "voice" | "image">("text");
  const dispatch = useAppDispatch();

  const currentMealType = route?.params?.mealType || "breakfast";

  const handleVoiceResult = (transcribedText: string) => {
    setQuery(transcribedText);
    setInputType("voice");
    setSelectedImageUri(null);
  };

  const handleFoodAnalysis = async () => {
    if (!query && !selectedImageUri) {
      setTimeout(() => {
        navigation.navigate("Dashboard", { mealType: currentMealType });
      }, 100);
      return;
    }

    try {
      setLoading(true);
      let payload: any;

      if (selectedImageUri) {
        payload = {
          analysis_type: "image",
          input_data: { image_data: selectedImageUri },
          response_level: responseLevel,
        };
        setInputType("image");
      } else if (query) {
        payload = {
          analysis_type: "text",
          input_data: { text_description: query },
          response_level: responseLevel,
        };
      }

      const resultAction = await dispatch(fetchFoodAnalysis(payload));

      setLoading(false);

      setTimeout(() => {
        navigation.navigate("AnalysisResults", {
          analysisData: resultAction.payload,
          foodName: query,
          inputType: inputType,
        });
      }, 100);
    } catch (error) {
      console.error("Food Analysis API Error:", error);
      setLoading(false);
      dispatch(
        showModal({
          type: "error",
          message: "Failed to analyze food. Please try again.",
        })
      );
    }
  };
const handleMenuPress = () => {

  navigation.navigate("AllScreensMenu");
};
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card - Matching other pages */}
        <View style={styles.headerCard}>
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80" }}
            style={styles.headerImageBg}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient
              colors={["rgba(255, 107, 53, 0.93)", "rgba(251, 146, 60, 0.90)"]}
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

        {/* Instructions Card */}
        <LinearGradient
          colors={["#E5E7EB", "#D1D5DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.instructionCard}
        >
          <View style={styles.instructionRow}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={24}
              color="#374151"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.instructionTitle}>Choose One Method</Text>
          </View>
          <View style={styles.methodList}>
            <View style={styles.methodItem}>
              <MaterialCommunityIcons name="camera" size={18} color="#FF6B35" />
              <Text style={styles.methodText}>Take or upload a photo of your meal</Text>
            </View>
            <View style={styles.methodItem}>
              <MaterialCommunityIcons name="message-text" size={18} color="#FF6B35" />
              <Text style={styles.methodText}>Describe your meal by voice or text</Text>
            </View>
                  
          </View>
          
        </LinearGradient>

        {/* Option 1: Image Input */}
        <ImagePickerSection
          selectedImageUri={selectedImageUri}
          setSelectedImageUri={setSelectedImageUri}
          setQuery={setQuery}
        />

        {/* Divider with "OR" */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Option 2: Voice/Text Input */}
        <View style={styles.voiceTextContainer}>
          <VoiceSearchSection
            onVoiceResult={handleVoiceResult}
            disabled={!!selectedImageUri}
          />

          <TextInputSection
            query={query}
            setQuery={setQuery}
            disabled={!!selectedImageUri}
          />
        </View>

        <ResponseLevelSection
          responseLevel={responseLevel}
          setResponseLevel={setResponseLevel}
        />
      </ScrollView>

      <AnalyzeButton
        loading={loading}
        disabled={!query && !selectedImageUri}
        onPress={handleFoodAnalysis}
      />
    </View>
  );
};



export default FoodAnalysisScreen;


// import React, { useState } from "react";
// import {
//   View,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { useAppDispatch } from "@/redux/store/hooks";
// import { fetchFoodAnalysis } from "@/redux/slice/mealPlanSlice";
// import { showModal } from "@/redux/slice/modalSlice";
// import DashboardHeader from "@/components/DashboardHeader";
// import { Colors } from "@/constants/Colors";
// import ImagePickerSection from "@/components/ui/ImagePickerSection";
// import TextInputSection from "@/components/foodanalysis/TextInputSection";
// import ResponseLevelSection from "@/components/foodanalysis/ResponseLevelSection";
// import AnalyzeButton from "@/components/foodanalysis/AnalyzeButton";
// import VoiceSearchSection from "./VoiceSearchSection";


// interface FoodAnalysisScreenProps {
//   navigation: any;
//   route: any;
// }

// const FoodAnalysisScreen: React.FC<FoodAnalysisScreenProps> = ({
//   navigation,
//   route,
// }) => {
//   const [query, setQuery] = useState("");
//   const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [responseLevel, setResponseLevel] = useState<"quick" | "detailed">("detailed");
//   const [inputType, setInputType] = useState<"text" | "voice" | "image">("text");
//   const dispatch = useAppDispatch();

//   const currentMealType = route?.params?.mealType || "breakfast";

//   const handleVoiceResult = (transcribedText: string) => {
//     setQuery(transcribedText);
//     setInputType("voice");
//     setSelectedImageUri(null);
//   };

//   const handleFoodAnalysis = async () => {
//     if (!query && !selectedImageUri) {
//       navigation.navigate("Dashboard", { mealType: currentMealType });
//       return;
//     }

//     try {
//       setLoading(true);
//       let payload: any;

//       if (selectedImageUri) {
//         payload = {
//           analysis_type: "image",
//           input_data: { image_data: selectedImageUri },
//           response_level: responseLevel,
//         };
//         setInputType("image");
//       } else if (query) {
//         payload = {
//           analysis_type: "text",
//           input_data: { text_description: query },
//           response_level: responseLevel,
//         };
//       }

//       const resultAction = await dispatch(fetchFoodAnalysis(payload));
//       navigation.navigate("AnalysisResults", {
//         analysisData: resultAction.payload,
//         foodName: query,
//         inputType: inputType,
//       });
//     } catch (error) {
//       console.error("Food Analysis API Error:", error);
//       dispatch(
//         showModal({
//           type: "error",
//           message: "Failed to analyze food. Please try again.",
//         })
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <DashboardHeader
//         compact
//         showTabs={false}
//         customHeaderConfig={{
//           backgroundColor: "#FF6B35",
//           title: "Food Analysis",
//           subtitle: "Analyze Your Meal Instantly",
//           description: "Upload a photo, describe, or speak about your food.",
//           titleColor: Colors.white,
//           subtitleColor: Colors.white,
//           descriptionColor: Colors.white,
//         }}
//       />

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <ImagePickerSection
//           selectedImageUri={selectedImageUri}
//           setSelectedImageUri={setSelectedImageUri}
//           setQuery={setQuery}
//         />

//         <VoiceSearchSection
//           onVoiceResult={handleVoiceResult}
//           disabled={!!selectedImageUri}
//         />

//         <TextInputSection
//           query={query}
//           setQuery={setQuery}
//           disabled={!!selectedImageUri}
//         />

//         <ResponseLevelSection
//           responseLevel={responseLevel}
//           setResponseLevel={setResponseLevel}
//         />
//       </ScrollView>

//       <AnalyzeButton
//         loading={loading}
//         disabled={!query && !selectedImageUri}
//         onPress={handleFoodAnalysis}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.white },
//   scrollContent: { paddingBottom: 200 },
// });

// export default FoodAnalysisScreen;