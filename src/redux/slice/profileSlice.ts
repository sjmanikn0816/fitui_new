import { Endpoints } from '@/constants/endpoints';
import { BASE_URL } from '@/services/base';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import DeviceInfo from 'react-native-device-info';

interface ProfileData {
  firstName: string | any | null;
  lastName: string;
  email: string;
  age: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  phone: string | null;
  profilePhoto: string;
  heightInFeet: string;
  heightInInches: string;
  gender: string;
  weightInLbs: string;
  dietPreference: string;
  isOnDiet: boolean;
  exerciseHabits: string;
  healthAppUsage: string;
  usageFrequency: string;
  isAppHelpful: boolean;
  isSleepMonitoring: boolean;
  travelPercentage: string;
  hasMedicalCondition: boolean;
  watchesDietContent: boolean;
  ethnicity: string;
  goal: string;
  birthMonth: string;
  birthYear: string;
  activityLevel: string;
  
  // Health Conditions
  preDiabetes: boolean;
  diabetes: boolean;
  highOrAbnormalCholesterol: boolean;
  depression: boolean;
  sleepApnea: boolean;
  obesity: boolean;
  hypertension: boolean;
  asthma: boolean;
  kidneyDisease: boolean;
  liverDisease: boolean;
  migraines: boolean;
  hivOrAids: boolean;
  thyroidDisorders: boolean;
  rheumatoidArthritis: boolean;
  crohnsDisease: boolean;
  epilepsy: boolean;
  multipleSclerosis: boolean;
  parkInSonsDisease: boolean;
  alzhemersDisease: boolean;
  anxietyDisorders: boolean;
  bipolarDisorder: boolean;
  schizophrenia: boolean;
  anyTypeOfCancer: boolean;
  leukemia: boolean;
}

interface ProfileState {
  data: ProfileData;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: ProfileState = {
  data: {
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    phone: '',
    profilePhoto: '',
    heightInFeet: '',
    heightInInches: '',
    gender: '',
    weightInLbs: '',
    dietPreference: '',
    isOnDiet: false,
    exerciseHabits: '',
    healthAppUsage: '',
    usageFrequency: '',
    isAppHelpful: false,
    isSleepMonitoring: false,
    travelPercentage: '',
    hasMedicalCondition: false,
    watchesDietContent: false,
    ethnicity: '',
    goal: '',
    birthMonth: '',
    birthYear: '',
    activityLevel: '',
    
    // Health Conditions
    preDiabetes: false,
    diabetes: false,
    highOrAbnormalCholesterol: false,
    depression: false,
    sleepApnea: false,
    obesity: false,
    hypertension: false,
    asthma: false,
    kidneyDisease: false,
    liverDisease: false,
    migraines: false,
    hivOrAids: false,
    thyroidDisorders: false,
    rheumatoidArthritis: false,
    crohnsDisease: false,
    epilepsy: false,
    multipleSclerosis: false,
    parkInSonsDisease: false,
    alzhemersDisease: false,
    anxietyDisorders: false,
    bipolarDisorder: false,
    schizophrenia: false,
    anyTypeOfCancer: false,
    leukemia: false,
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, profileData }: { userId: string; profileData: ProfileData }, { rejectWithValue }) => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const queryParams = new URLSearchParams({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        age: profileData.age || '',
        address: profileData.streetAddress || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zip: profileData.zip || '',
        country: profileData.country || '',
        contactName: profileData.emergencyContactName || '',
        contactPhone: profileData.emergencyContactPhone || '',
        phoneNumber: profileData.phone || '',
        heightInFeet: profileData.heightInFeet || '',
        heightInInches: profileData.heightInInches || '',
        gender: profileData.gender || '',
        weightInLbs: profileData.weightInLbs || '',
        dietPreference: profileData.dietPreference || '',
        isOnDiet: String(profileData.isOnDiet),
        exerciseHabits: profileData.exerciseHabits || '',
        healthAppUsage: profileData.healthAppUsage || '',
        usageFrequency: profileData.usageFrequency || '',
        isAppHelpful: String(profileData.isAppHelpful),
        isSleepMonitoring: String(profileData.isSleepMonitoring),
        travelPercentage: profileData.travelPercentage || '',
        hasMedicalCondition: String(profileData.hasMedicalCondition),
        watchesDietContent: String(profileData.watchesDietContent),
        ethnicity: profileData.ethnicity || '',
        goal: profileData.goal || '',
        birthMonth: profileData.birthMonth || '',
        birthYear: profileData.birthYear || '',
        activityLevel: profileData.activityLevel || '',
        
        // Health Conditions
        preDiabetes: String(profileData.preDiabetes || false),
        diabetes: String(profileData.diabetes || false),
        highOrAbnormalCholesterol: String(profileData.highOrAbnormalCholesterol || false),
        depression: String(profileData.depression || false),
        sleepApnea: String(profileData.sleepApnea || false),
        obesity: String(profileData.obesity || false),
        hypertension: String(profileData.hypertension || false),
        asthma: String(profileData.asthma || false),
        kidneyDisease: String(profileData.kidneyDisease || false),
        liverDisease: String(profileData.liverDisease || false),
        migraines: String(profileData.migraines || false),
        hivOrAids: String(profileData.hivOrAids || false),
        thyroidDisorders: String(profileData.thyroidDisorders || false),
        rheumatoidArthritis: String(profileData.rheumatoidArthritis || false),
        crohnsDisease: String(profileData.crohnsDisease || false),
        epilepsy: String(profileData.epilepsy || false),
        multipleSclerosis: String(profileData.multipleSclerosis || false),
        parkInSonsDisease: String(profileData.parkInSonsDisease || false),
        alzhemersDisease: String(profileData.alzhemersDisease || false),
        anxietyDisorders: String(profileData.anxietyDisorders || false),
        bipolarDisorder: String(profileData.bipolarDisorder || false),
        schizophrenia: String(profileData.schizophrenia || false),
        anyTypeOfCancer: String(profileData.anyTypeOfCancer || false),
        leukemia: String(profileData.leukemia || false),
      }).toString();
      console.log(queryParams);

      const formData = new FormData();
      formData.append('profileImage', '');

      const response = await fetch(
        `${BASE_URL}${Endpoints.USER.EDIT_USER}${userId}?${queryParams}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
              "X-Device-ID": deviceId,
          },
          body: formData,
        }
                

      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Failed: ${response.status} ${text}`);
      }

      const data = JSON.parse(text);

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.data = action.payload;
    },
    updateProfileField: <K extends keyof ProfileData>(
      state: ProfileState,
      action: PayloadAction<{ field: K; value: ProfileData[K] }>
    ) => {
      state.data[action.payload.field] = action.payload.value;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        
        const { user, address,healthCondition,immuneDisorder,neurologicalHealth,cancer} = action.payload;
        
        if (user && address && healthCondition && immuneDisorder && neurologicalHealth &&cancer) {
          state.data = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            age: user.age ? String(user.age) : '',
            streetAddress: address.address || '',
            city: address.city || '',
            state: address.state || '',
            zip: address.zip || '',
            country: address.country || '',
            emergencyContactName: address.contactName || '',
            emergencyContactPhone: address.contactPhone || '',
            phone: address.phoneNumber || '',
            profilePhoto: user.profileImage || '',
            heightInFeet: user.heightInFeet ? String(user.heightInFeet) : '',
            heightInInches: user.heightInInches ? String(user.heightInInches) : '',
            gender: user.gender || '',
            weightInLbs: user.weightInLbs ? String(user.weightInLbs) : '',
            dietPreference: user.dietPreference || '',
            isOnDiet: user.isOnDiet || false,
            exerciseHabits: user.exerciseHabits || '',
            healthAppUsage: user.healthAppUsage || '',
            usageFrequency: user.usageFrequency || '',
            isAppHelpful: user.isAppHelpful || false,
            isSleepMonitoring: user.isSleepMonitoring || false,
            travelPercentage: user.travelPercentage ? String(user.travelPercentage) : '',
            hasMedicalCondition: user.hasMedicalCondition || false,
            watchesDietContent: user.watchesDietContent || false,
            ethnicity: user.ethnicity || '',
            goal: user.goal || '',
            birthMonth: user.birthMonth ? String(user.birthMonth) : '',
            birthYear: user.birthYear ? String(user.birthYear) : '',
            activityLevel: user.activityLevel || '',
            
            // Health Conditions
            preDiabetes: healthCondition.preDiabetes || false,
            diabetes: healthCondition.diabetes || false,
            highOrAbnormalCholesterol: healthCondition.highOrAbnormalCholesterol || false,
            depression: healthCondition.depression || false,
            sleepApnea: healthCondition.sleepApnea || false,
            obesity: healthCondition.obesity || false,
            hypertension: healthCondition.hypertension || false,
            asthma: healthCondition.asthma || false,
            kidneyDisease: healthCondition.kidneyDisease || false,
            liverDisease: healthCondition.liverDisease || false,
            migraines: healthCondition.migraines || false,


            hivOrAids: immuneDisorder.hivOrAids || false,
            thyroidDisorders: immuneDisorder.thyroidDisorders || false,
            rheumatoidArthritis: immuneDisorder.rheumatoidArthritis || false,
            crohnsDisease: immuneDisorder.crohnsDisease || false,


            epilepsy: neurologicalHealth.epilepsy || false,
            multipleSclerosis: neurologicalHealth.multipleSclerosis || false,
            parkInSonsDisease: neurologicalHealth.parkInSonsDisease || false,
            alzhemersDisease: neurologicalHealth.alzhemersDisease || false,
            anxietyDisorders: neurologicalHealth.anxietyDisorders || false,
            bipolarDisorder: neurologicalHealth.bipolarDisorder || false,
            schizophrenia: neurologicalHealth.schizophrenia || false,


            anyTypeOfCancer: cancer.anyTypeOfCancer || false,
            leukemia: cancer.leukemia || false,
          };
        }
        
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfileData, updateProfileField, clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;