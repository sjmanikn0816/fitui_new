import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSelector } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { styles } from "../styles/HealthProfileScreenStyles";
import { Colors } from "@/constants/Colors";
import { scale, verticalScale } from "@/utils/responsive";

import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import ScrollContainer from "@/components/ui/ScrollContainer";
import { RootState } from "@/redux/store";
import MainHeader from "@/components/ui/MainHeaderNav";
import { setAuthToken } from "@/redux/slice/auth/authSlice";
import { showModal } from "@/redux/slice/modalSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Activity, Check } from "lucide-react-native";


type HealthProfileScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "HealthProfile"
>;

interface Props {
  navigation: HealthProfileScreenNavigationProp;
}

// Diabetes types interface
interface DiabetesType {
  id: string;
  label: string;
  subtitle: string;
}

const HealthProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const signuptoken = useSelector((state: RootState) => state.auth.signuptoken);
  const signupuser = useSelector((state: RootState) => state.auth.user);

  // Terms checkbox
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Diabetes screening
  const [hasDiabetes, setHasDiabetes] = useState<boolean | null>(null);
  const [selectedDiabetesType, setSelectedDiabetesType] = useState<string | null>(null);

  // Diabetes types data
  const diabetesTypes: DiabetesType[] = [
    {
      id: "type1",
      label: "Type 1 Diabetes",
      subtitle: "Autoimmune condition, insulin-dependent",
    },
    {
      id: "type2",
      label: "Type 2 Diabetes",
      subtitle: "Insulin resistance, most common type",
    },
    {
      id: "gestational",
      label: "Gestational Diabetes",
      subtitle: "Develops during pregnancy",
    },
    {
      id: "prediabetes",
      label: "Prediabetes",
      subtitle: "Higher than normal blood sugar levels",
    },
    {
      id: "type3c",
      label: "Type 3c (Pancreatogenic)",
      subtitle: "Caused by pancreatic disease or injury",
    },
    {
      id: "lada",
      label: "LADA (Type 1.5)",
      subtitle: "Latent autoimmune diabetes in adults",
    },
    {
      id: "mody",
      label: "MODY",
      subtitle: "Genetic form, diagnosed before age 25",
    },
    {
      id: "secondary",
      label: "Secondary Diabetes",
      subtitle: "Caused by other conditions or medications",
    },
  ];

  // Complete Profile
  const handleCompleteProfile = async () => {
    if (!acceptedTerms) {
      dispatch(
        showModal({
          type: "error",
          message: "Please agree to the Terms & Conditions.",
        })
      );
      return;
    }

    // ============================================================================
    // TODO: BACKEND INTEGRATION - Store diabetes data to backend
    // ============================================================================
    // For now, we're just storing the diabetes data in JSON format locally
    // This needs to be integrated with backend API later
    // ============================================================================

    const diabetesData = {
      hasDiabetes,
      diabetesType: selectedDiabetesType,
      timestamp: new Date().toISOString(),
    };

    console.log("========================================");
    console.log("📋 Diabetes Health Profile Data (JSON):");
    console.log("========================================");
    console.log(JSON.stringify(diabetesData, null, 2));
    console.log("========================================");
    console.log("⚠️ TODO: Integrate this data with backend API");
    console.log("========================================");

    // Complete registration
    dispatch(setAuthToken({ token: signuptoken, user: signupuser || {} }));
    dispatch(
      showModal({
        type: "success",
        message: "Profile completed successfully!",
      })
    );
  };

  // Skip flow
  const handleSkip = () => {
    if (!acceptedTerms) {
      dispatch(
        showModal({
          type: "error",
          message: "Please agree to the Terms & Conditions.",
        })
      );
      return;
    }

    console.log("⚠️ User skipped diabetes health screening");
    dispatch(setAuthToken({ token: signuptoken, user: signupuser || {} }));
  };

  return (
    <>
      <MainHeader
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        title=" "
        onSkipPress={handleSkip}
      />

      <ScrollContainer>
        <View style={styles.header}>
          <Logo />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Diabetes Screening</Text>
          <Text style={styles.subtitle}>
            Help us personalize your nutrition plan for better diabetes management
          </Text>

          <View style={styles.form}>
            {/* Question: Do you have diabetes? */}
            <View style={{ marginBottom: verticalScale(24) }}>
              <Text style={styles.questionTitle}>Do you have diabetes?</Text>
              <View style={{ flexDirection: "row", gap: scale(12), marginTop: verticalScale(12) }}>
                <TouchableOpacity
                  style={[
                    styles.yesNoButton,
                    hasDiabetes === true && styles.yesNoButtonSelected,
                  ]}
                  onPress={() => {
                    setHasDiabetes(true);
                    setSelectedDiabetesType(null); // Reset selection when changing answer
                  }}
                >
                  <Text
                    style={[
                      styles.yesNoButtonText,
                      hasDiabetes === true && styles.yesNoButtonTextSelected,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.yesNoButton,
                    hasDiabetes === false && styles.yesNoButtonSelected,
                  ]}
                  onPress={() => {
                    setHasDiabetes(false);
                    setSelectedDiabetesType(null); // Clear diabetes type
                  }}
                >
                  <Text
                    style={[
                      styles.yesNoButtonText,
                      hasDiabetes === false && styles.yesNoButtonTextSelected,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Show diabetes types if user has diabetes */}
            {hasDiabetes === true && (
              <View style={{ marginBottom: verticalScale(24) }}>
                <Text style={styles.questionTitle}>What type of diabetes do you have?</Text>
                <View style={{ marginTop: verticalScale(12) }}>
                  {diabetesTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.diabetesCard,
                        selectedDiabetesType === type.id && styles.diabetesCardSelected,
                      ]}
                      onPress={() => setSelectedDiabetesType(type.id)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.diabetesCardLabel,
                            selectedDiabetesType === type.id && styles.diabetesCardLabelSelected,
                          ]}
                        >
                          {type.label}
                        </Text>
                        <Text style={styles.diabetesCardSubtitle}>{type.subtitle}</Text>
                      </View>
                      {selectedDiabetesType === type.id && (
                        <Check size={24} color={Colors.primary} strokeWidth={3} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", marginTop: verticalScale(20) }}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderWidth: 1.5,
                  borderColor: Colors.primary,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  backgroundColor: acceptedTerms ? Colors.primary : "transparent",
                }}
              >
                {acceptedTerms && (
                  <Text style={{ color: Colors.white, fontWeight: "bold" }}>✓</Text>
                )}
              </View>
              <Text style={{ flex: 1, color: Colors.textDark, fontSize: scale(13) }}>
                I agree to the{" "}
                <Text
                  style={{
                    color: Colors.primary,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => Linking.openURL("https://y-xis.com/terms")}
                >
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text
                  style={{
                    color: Colors.primary,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => Linking.openURL("https://y-xis.com/privacy")}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: verticalScale(32),
              marginBottom: verticalScale(16),
              gap: scale(12),
            }}
          >
            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={{ flex: 0.3 }}
              textStyle={styles.backText}
              disabled={loading}
            />
            <Button
              title="Complete Profile"
              onPress={handleCompleteProfile}
              loading={loading}
              disabled={loading}
              style={{ flex: 0.65, backgroundColor: Colors.primary }}
            />
          </View>
        </View>
      </ScrollContainer>

      <LoadingSpinner visible={loading} message="Completing your health profile..." />
    </>
  );
};

export default HealthProfileScreen;
