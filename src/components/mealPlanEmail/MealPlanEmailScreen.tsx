import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { ScrollView, StyleSheet, Alert, SafeAreaView } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import FormInputs from './FormInputs';
import MealPlanPreview from './MealPlanPreview';
import ActionButtons from './ActionButtons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { generateMealPlanHTML } from '@/utils/htmlGenerator';
import { sendMealPlanEmail, resetEmailState } from '@/redux/slice/mealPlanSlice';
import { verticalScale } from '@/utils/responsive';

interface RouteParams { mealPlan: any; }

const MealPlanEmailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { mealPlan } = route.params as RouteParams;

  const { emailLoading, emailSuccess, emailError } = useAppSelector(state => state.mealPlan);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { resetForm(); }, []);

  useEffect(() => {
    if (emailSuccess) {
      Alert.alert('Success', 'Email sent successfully!', [{ text: 'OK', onPress: handleBack }]);
      dispatch(resetEmailState());
    }
    if (emailError) {
      Alert.alert('Error', emailError);
      dispatch(resetEmailState());
    }
  }, [emailSuccess, emailError]);

  const resetForm = () => { setName(''); setEmail(''); setDescription(''); setLoading(false); };
  const handleBack = () => { if (loading || emailLoading) return; navigation.goBack(); };

const handleDownloadPDF = async () => {
  try {
    setLoading(true);
    const html = generateMealPlanHTML(mealPlan, name, description);
    const { uri } = await Print.printToFileAsync({ html });
    
  
    const sanitizedName =user?.firstName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    console.log(sanitizedName)
    const fileName = `${sanitizedName}_meal_plan.pdf`;
    
    
    const directory = uri.substring(0, uri.lastIndexOf('/') + 1);
    const newUri = directory + fileName;
    
    
    await FileSystem.moveAsync({
      from: uri,
      to: newUri
    });
    
    await Sharing.shareAsync(newUri, { 
      UTI: '.pdf', 
      mimeType: 'application/pdf', 
      dialogTitle: 'Download Meal Plan PDF'
    });
    
    Alert.alert('Success', 'PDF downloaded successfully!');
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Failed to generate PDF');
  } finally { 
    setLoading(false); 
  }
};
 const handleSendEmail = async () => {
  if (!email) { Alert.alert('Error', 'Please enter email'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
    Alert.alert('Error', 'Please enter a valid email'); 
    return; 
  }

  try {
    setLoading(true);
    const html = generateMealPlanHTML(mealPlan, name, description);
    const { uri } = await Print.printToFileAsync({ html });
    
    const sanitizedName = user?.firstName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${sanitizedName}_meal_plan.pdf`;
    
    const directory = uri.substring(0, uri.lastIndexOf('/') + 1);
    const newUri = directory + fileName;
    await FileSystem.moveAsync({
      from: uri,
      to: newUri
    });
    
    dispatch(sendMealPlanEmail({ 
      mealPlan, 
      name, 
      email, 
      description, 
      pdfUri: newUri 
    }));
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Failed to send email');
  } finally { 
    setLoading(false); 
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FormInputs
          customerName={name} customerEmail={email} additionalNotes={description}
          onNameChange={setName} onEmailChange={setEmail} onNotesChange={setDescription}
          disabled={loading || emailLoading}
        />
        <MealPlanPreview mealPlan={mealPlan} />
        <ActionButtons
          onDownload={handleDownloadPDF} onSendEmail={handleSendEmail}
          loading={loading || emailLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' ,paddingBottom:verticalScale(60)},
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
});

export default MealPlanEmailScreen;
