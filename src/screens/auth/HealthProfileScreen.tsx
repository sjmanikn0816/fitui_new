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
import { HealthCondition } from "@/types";
import {
  cancerConditions,
  foodAllergies,
  healthConditions,
  immuneDisorders,
  neurologicalConditions,
} from "@/data/dummyData";
import ConditionSelector from "@/components/ConditionSelector";
import { RootState } from "@/redux/store";
import {
  submitCancerConditions,
  submitFoodAllergies,
  submitHealthConditions,
  submitImmuneDisorders,
  submitNeurologicalAndMentalHealth,
} from "@/redux/slice/healthProfileSlice";
import ProgressSteps from "./components/ProgressSteps";
import MainHeader from "@/components/ui/MainHeaderNav";
import { setAuthToken } from "@/redux/slice/auth/authSlice";
import { showModal } from "@/redux/slice/modalSlice";
import { useAppDispatch } from "@/redux/store/hooks";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TermsModal from "@/components/ui/TermsModal";


type HealthProfileScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "HealthProfile"
>;

interface Props {
  navigation: HealthProfileScreenNavigationProp;
}

const HealthProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.healthProfile.loading);
  const signuptoken = useSelector((state: RootState) => state.auth.signuptoken);
  const signupuser = useSelector((state: RootState) => state.auth.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Terms checkbox
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Health data toggles
  const [hasHealthConditions, setHasHealthConditions] = useState(false);
  const [selectedHealthConditions, setSelectedHealthConditions] =
    useState<HealthCondition[]>(healthConditions);

  const [hasImmuneDisorders, setHasImmuneDisorders] = useState(false);
  const [selectedImmDisorders, setSelectedImmDisorders] =
    useState<HealthCondition[]>(immuneDisorders);

  const [hasCancerConditions, setHasCancerConditions] = useState(false);
  const [selectedCancerConditions, setSelectedCancerConditions] =
    useState<HealthCondition[]>(cancerConditions);

  const [hasFoodAllergies, setHasFoodAllergies] = useState(false);
  const [selectedFoodAllergies, setSelectedFoodAllergies] =
    useState<HealthCondition[]>(foodAllergies);

  const [hasNeuroMentalHealth, setHasNeuroMentalHealth] = useState(false);
  const [selectedNeuroMentalHealth, setSelectedNeuroMentalHealth] =
    useState<HealthCondition[]>(neurologicalConditions);

  const handleToggle = (
    prev: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setState(!prev);
    setCurrentStep((step) => step + (!prev ? 1 : -1));
  };

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

    try {
      const promises: Promise<any>[] = [];

      if (hasHealthConditions)
        promises.push(
          dispatch(submitHealthConditions(selectedHealthConditions)).unwrap()
        );
      if (hasImmuneDisorders)
        promises.push(
          dispatch(submitImmuneDisorders(selectedImmDisorders)).unwrap()
        );
      if (hasCancerConditions)
        promises.push(
          dispatch(submitCancerConditions(selectedCancerConditions)).unwrap()
        );
      if (hasFoodAllergies)
        promises.push(
          dispatch(submitFoodAllergies(selectedFoodAllergies)).unwrap()
        );
      if (hasNeuroMentalHealth)
        promises.push(
          dispatch(
            submitNeurologicalAndMentalHealth(selectedNeuroMentalHealth)
          ).unwrap()
        );

      await Promise.all(promises);
         dispatch(setAuthToken({ token: signuptoken, user: signupuser || {} }));
      // setShowTermsModal(true);
    } catch (error: any) {
      dispatch(
        showModal({
          type: "error",
          message: error?.message || "Something went wrong",
        })
      );
    }
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
       dispatch(setAuthToken({ token: signuptoken, user: signupuser || {} }));
    // setShowTermsModal(true);
  };

  // When terms accepted
  const handleTermsAccepted = () => {
    setShowTermsModal(false);
    dispatch(setAuthToken({ token: signuptoken, user: signupuser || {} }));
    dispatch(
      showModal({
        type: "success",
        message: "Profile completed successfully!",
      })
    );
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
          <ProgressSteps totalSteps={5} currentStep={currentStep} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Health Profile</Text>
          <Text style={styles.subtitle}>
            fitAI will suggest more targeted nutrition advice
          </Text>

          <View style={styles.form}>
            <ConditionSelector
              title="Health Conditions (Optional)"
              subtitle="I have health conditions that affect my diet"
              enabled={hasHealthConditions}
              setEnabled={() =>
                handleToggle(hasHealthConditions, setHasHealthConditions)
              }
              conditions={selectedHealthConditions}
              setConditions={setSelectedHealthConditions}
            />
            <ConditionSelector
              title="Immune & Autoimmune Disorders (Optional)"
              subtitle="I have health conditions that affect my diet"
              enabled={hasImmuneDisorders}
              setEnabled={() =>
                handleToggle(hasImmuneDisorders, setHasImmuneDisorders)
              }
              conditions={selectedImmDisorders}
              setConditions={setSelectedImmDisorders}
            />
            <ConditionSelector
              title="Cancers (Optional)"
              subtitle="I have health conditions that affect my diet"
              enabled={hasCancerConditions}
              setEnabled={() =>
                handleToggle(hasCancerConditions, setHasCancerConditions)
              }
              conditions={selectedCancerConditions}
              setConditions={setSelectedCancerConditions}
            />
            <ConditionSelector
              title="Neurological & Mental Health (Optional)"
              subtitle="I have health conditions that affect my diet"
              enabled={hasNeuroMentalHealth}
              setEnabled={() =>
                handleToggle(hasNeuroMentalHealth, setHasNeuroMentalHealth)
              }
              conditions={selectedNeuroMentalHealth}
              setConditions={setSelectedNeuroMentalHealth}
            />

             <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
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
                  <Text style={{ color: Colors.white, fontWeight: "bold" }}>
                    ✓
                  </Text>
                )}
              </View>
              <Text style={{ flex: 1, color: Colors.textDark }}>
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

          {/* Terms Checkbox */}
          <View style={{ marginTop: verticalScale(20) }}>
           
          </View>

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "auto",
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

      <LoadingSpinner
        visible={loading}
        message="Completing your health profile..."
      />

      <TermsModal
        visible={showTermsModal}
        onAccept={handleTermsAccepted}
        onClose={() => setShowTermsModal(false)}
      />
    </>
  );
};

export default HealthProfileScreen;
