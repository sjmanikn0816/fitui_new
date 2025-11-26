import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector } from "@/redux/store/hooks";
import { styles } from "../styles/NutritionPlanStyles";
import NutritionPlanHeader from "@/components/nutritionplan/NutritionPlanHeader";
import NutritionPlanOverview from "@/components/nutritionplan/NutritionPlanOverview";
import NutritionalTargets from "@/components/nutritionplan/NutritionalTargets";

const NutritionPlanScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAppSelector((state) => state.auth.user);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);

  const hasCompletedRegistration = user?.weightInKg && user?.targetWeight;

  useEffect(() => {
    if (route.params?.registrationCompleted) {
      setRegistrationCompleted(true);
      return;
    }

    if (!hasCompletedRegistration && !registrationCompleted) {
      const timer = setTimeout(() => {
        navigation.navigate('WeightJourneyRegistration');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [hasCompletedRegistration, registrationCompleted, navigation, route.params]);

  if (!hasCompletedRegistration && !registrationCompleted) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NutritionPlanHeader />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <NutritionPlanOverview />
        <NutritionalTargets />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutritionPlanScreen;
