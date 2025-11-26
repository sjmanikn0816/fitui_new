import React, { useState } from "react";
import { 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Text,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import { showModal } from "@/redux/slice/modalSlice";
import { updateProfile } from "../../../redux/slice/profileSlice";
import { updateUserProfile } from "@/redux/slice/auth/authSlice";
import { showConfirmation } from "@/redux/slice/conformationSlice";
import { styles } from "./styles/ProfileeditScreenStyles";
import ProfilePhotoSection from "../../../components/ui/ProfilePhotoSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BasicAndPhysicalInfo from "./EditProfileComponents/BasicAndPhysicalInfo";
import HealthAndFitnessInfo from "./EditProfileComponents/HealthAndFitnessInfo";
import AddressAndContactInfo from "./EditProfileComponents/AddressAndContactInfo";

const ProfileEditScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const address = useAppSelector((state) => state.auth.address);
  const healthCondition = useAppSelector((state) => state.auth.healthCondition);
  const immuneDisorder = useAppSelector((state) => state.auth.immuneDisorder);
  const neurologicalHealth = useAppSelector((state) => state.auth.neurologicalHealth);
  const cancer = useAppSelector((state) => state.auth.cancer);

  const [loader, setloader] = useState(false);
  const { loading } = useAppSelector((state) => state.profile);

  const toBool = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  };

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user.address?.phoneNumber || "",
    age: user?.age || "",
    streetAddress: user.address?.address || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    zip: user.address?.zip || "",
    country: user.address?.country || "",
    emergencyContactName: user.address?.contactName || "",
    emergencyContactPhone: user.address?.contactPhone || "",
    profilePhoto: user?.profileImage || "",
    heightInFeet: user?.heightInFeet || "",
    heightInInches: user?.heightInInches || "",
    gender: user?.gender || "",
    weightInLbs: user?.weightInLbs || "",
    dietPreference: user?.dietPreference || "",
    isOnDiet: toBool(user?.isOnDiet),
    exerciseHabits: user?.exerciseHabits || "",
    healthAppUsage: user?.healthAppUsage || "",
    usageFrequency: user?.usageFrequency || "",
    isAppHelpful: toBool(user?.appHelpful),
    isSleepMonitoring: toBool(user?.sleepMonitoring),
    travelPercentage: user?.travelPercentage || "",
    hasMedicalCondition: toBool(user?.hasMedicalCondition),
    watchesDietContent: toBool(user?.watchesDietContent),
    ethnicity: user?.ethnicity || "",
    goal: user?.goal || "",
    birthMonth: user?.birthMonth || "",
    birthYear: user?.birthYear || "",
    activityLevel: user?.activityLevel || "",
    preDiabetes: toBool(healthCondition?.preDiabetes),
    diabetes: toBool(healthCondition?.diabetes),
    highOrAbnormalCholesterol: toBool(healthCondition?.highOrAbnormalCholesterol),
    depression: toBool(healthCondition?.depression),
    sleepApnea: toBool(healthCondition?.sleepApnea),
    obesity: toBool(healthCondition?.obesity),
    hypertension: toBool(healthCondition?.hypertension),
    asthma: toBool(healthCondition?.asthma),
    kidneyDisease: toBool(healthCondition?.kidneyDisease),
    liverDisease: toBool(healthCondition?.liverDisease),
    migraines: toBool(healthCondition?.migraines),
    hivOrAids: toBool(immuneDisorder?.hivOrAids),
    thyroidDisorders: toBool(immuneDisorder?.thyroidDisorders),
    rheumatoidArthritis: toBool(immuneDisorder?.rheumatoidArthritis),
    crohnsDisease: toBool(immuneDisorder?.crohnsDisease),
    epilepsy: toBool(neurologicalHealth?.epilepsy),
    multipleSclerosis: toBool(neurologicalHealth?.multipleSclerosis),
    parkInSonsDisease: toBool(neurologicalHealth?.parkInSonsDisease),
    alzhemersDisease: toBool(neurologicalHealth?.alzhemersDisease),
    anxietyDisorders: toBool(neurologicalHealth?.anxietyDisorders),
    bipolarDisorder: toBool(neurologicalHealth?.bipolarDisorder),
    schizophrenia: toBool(neurologicalHealth?.schizophrenia),
    anyTypeOfCancer: toBool(cancer?.anyTypeOfCancer),
    leukemia: toBool(cancer?.leukemia),
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePicked = (uri: string) => {
    setProfileData((prev) => ({ ...prev, profilePhoto: uri }));
  };

  const handleSaveChanges = async () => {
    if (!user || !user.userId) {
      dispatch(showModal({ type: "error", message: "User ID not found." }));
      return;
    }

    dispatch(
      showConfirmation({
        title: 'Edit profile',
        message: 'Are you sure you want to change the Profile?',
        onConfirm: async () => {
          try {
            setloader(true);
            const result = await dispatch(updateProfile({
              userId: user.userId,
              profileData
            })).unwrap();

            dispatch(updateUserProfile({
              user: result.user,
              address: result.address,
              healthCondition: result.healthCondition,
              immuneDisorder: result.immuneAndAutoImmuneDisorder,
              neurologicalHealth: result.neurologicalAndMentalHealth,
              cancer: result.cancer
            }));

            setProfileData({
              firstName: result.user?.firstName || "",
              lastName: result.user?.lastName || "",
              email: result.user?.email || "",
              phone: result.address?.phoneNumber || "",
              age: result.user?.age || "",
              streetAddress: result.address?.address || "",
              city: result.address?.city || "",
              state: result.address?.state || "",
              zip: result.address?.zip || "",
              country: result.address?.country || "",
              emergencyContactName: result.address?.contactName || "",
              emergencyContactPhone: result.address?.contactPhone || "",
              profilePhoto: result.user?.profileImage || "",
              heightInFeet: result.user?.heightInFeet || "",
              heightInInches: result.user?.heightInInches || "",
              gender: result.user?.gender || "",
              weightInLbs: result.user?.weightInLbs || "",
              dietPreference: result.user?.dietPreference || "",
              isOnDiet: toBool(result.user?.isOnDiet),
              exerciseHabits: result.user?.exerciseHabits || "",
              healthAppUsage: result.user?.healthAppUsage || "",
              usageFrequency: result.user?.usageFrequency || "",
              isAppHelpful: toBool(result.user?.appHelpful),
              isSleepMonitoring: toBool(result.user?.sleepMonitoring),
              travelPercentage: result.user?.travelPercentage || "",
              hasMedicalCondition: toBool(result.user?.hasMedicalCondition),
              watchesDietContent: toBool(result.user?.watchesDietContent),
              ethnicity: result.user?.ethnicity || "",
              goal: result.user?.goal || "",
              birthMonth: result.user?.birthMonth || "",
              birthYear: result.user?.birthYear || "",
              activityLevel: result.user?.activityLevel || "",
              preDiabetes: toBool(result.healthCondition?.preDiabetes),
              diabetes: toBool(result.healthCondition?.diabetes),
              highOrAbnormalCholesterol: toBool(result.healthCondition?.highOrAbnormalCholesterol),
              depression: toBool(result.healthCondition?.depression),
              sleepApnea: toBool(result.healthCondition?.sleepApnea),
              obesity: toBool(result.healthCondition?.obesity),
              hypertension: toBool(result.healthCondition?.hypertension),
              asthma: toBool(result.healthCondition?.asthma),
              kidneyDisease: toBool(result.healthCondition?.kidneyDisease),
              liverDisease: toBool(result.healthCondition?.liverDisease),
              migraines: toBool(result.healthCondition?.migraines),
              hivOrAids: toBool(result.immuneAndAutoImmuneDisorder?.hivOrAids),
              thyroidDisorders: toBool(result.immuneAndAutoImmuneDisorder?.thyroidDisorders),
              rheumatoidArthritis: toBool(result.immuneAndAutoImmuneDisorder?.rheumatoidArthritis),
              crohnsDisease: toBool(result.immuneAndAutoImmuneDisorder?.crohnsDisease),
              epilepsy: toBool(result.neurologicalAndMentalHealth?.epilepsy),
              multipleSclerosis: toBool(result.neurologicalAndMentalHealth?.multipleSclerosis),
              parkInSonsDisease: toBool(result.neurologicalAndMentalHealth?.parkInSonsDisease),
              alzhemersDisease: toBool(result.neurologicalAndMentalHealth?.alzhemersDisease),
              anxietyDisorders: toBool(result.neurologicalAndMentalHealth?.anxietyDisorders),
              bipolarDisorder: toBool(result.neurologicalAndMentalHealth?.bipolarDisorder),
              schizophrenia: toBool(result.neurologicalAndMentalHealth?.schizophrenia),
              anyTypeOfCancer: toBool(result.cancer?.anyTypeOfCancer),
              leukemia: toBool(result.cancer?.leukemia),
            });

            dispatch(showModal({
              type: "success",
              message: "Your profile has been updated successfully!",
            }));
          } catch (error) {
            
            dispatch(showModal({
              type: "error",
              message: "Failed to update profile. Please try again later.",
            }));
          } finally {
            setloader(false);
          }
        },
        onCancel: () => { },
      })
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner visible={true} message="Loading profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <ProfilePhotoSection
            imageUri={profileData.profilePhoto}
            onImagePicked={handleImagePicked}
          />

          <BasicAndPhysicalInfo
            profileData={profileData}
            loading={loading}
            onInputChange={handleInputChange}
          />

          <HealthAndFitnessInfo
            profileData={profileData}
            loading={loading}
            onInputChange={handleInputChange}
          />

          <AddressAndContactInfo
            profileData={profileData}
            loading={loading}
            onInputChange={handleInputChange}
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.6 }]}
            onPress={handleSaveChanges}
            disabled={loader}
          >
            <Text style={styles.saveButtonText}>💾 Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingSpinner visible={loader} message="Updating..." />
    </SafeAreaView>
  );
};

export default ProfileEditScreen;