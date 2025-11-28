// MealPlanEmailScreen.tsx - Fixed close functionality
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaViewBase,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';

interface MealPlanEmailScreenProps {
  mealPlan: any;
  visible: boolean;
  onClose: () => void;
}

const MealPlanEmailScreen: React.FC<MealPlanEmailScreenProps> = ({ 
  mealPlan, 
  visible, 
  onClose 
}) => {
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setCustomerEmail('');
      setCustomerName('');
      setAdditionalNotes('');
      setLoading(false);
    }
  }, [visible]);

  const handleClose = () => {
    if (loading) return; // Prevent closing while loading
    onClose();
  };

  // Generate HTML content for PDF
  const generateHTMLContent = () => {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const renderMealSection = (title: string, meals: any[]) => {
      if (!meals || meals.length === 0) return '';
      
      return `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">
            ${title}
          </h3>
          ${meals.map(meal => `
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #10b981;">
              <h4 style="color: #111827; margin: 0 0 10px 0; font-size: 16px;">${meal.name || 'Meal'}</h4>
              ${meal.description ? `<p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">${meal.description}</p>` : ''}
              
              ${meal.nutrition ? `
                <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 10px;">
                  <div style="background: white; padding: 8px 12px; border-radius: 6px;">
                    <strong style="color: #10b981;">Calories:</strong> ${meal.nutrition.calories || 0}
                  </div>
                  <div style="background: white; padding: 8px 12px; border-radius: 6px;">
                    <strong style="color: #3b82f6;">Protein:</strong> ${meal.nutrition.protein_g || 0}g
                  </div>
                  <div style="background: white; padding: 8px 12px; border-radius: 6px;">
                    <strong style="color: #f59e0b;">Carbs:</strong> ${meal.nutrition.carbs_g || 0}g
                  </div>
                  <div style="background: white; padding: 8px 12px; border-radius: 6px;">
                    <strong style="color: #ef4444;">Fat:</strong> ${meal.nutrition.fat_g || 0}g
                  </div>
                </div>
              ` : ''}

              ${meal.recipe?.ingredients ? `
                <div style="margin-top: 15px;">
                  <strong style="color: #374151;">Ingredients:</strong>
                  <ul style="margin: 8px 0; padding-left: 20px; color: #6b7280;">
                    ${meal.recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${meal.recipe?.instructions ? `
                <div style="margin-top: 10px;">
                  <strong style="color: #374151;">Instructions:</strong>
                  <ol style="margin: 8px 0; padding-left: 20px; color: #6b7280;">
                    ${meal.recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
                  </ol>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    };

    const plan = mealPlan?.daily_plan || mealPlan;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Meal Plan - ${customerName || 'Customer'}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 12px;">
            <h1 style="margin: 0; font-size: 28px;">Your Personalized Meal Plan</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${today}</p>
            ${customerName ? `<p style="margin: 5px 0 0 0; font-size: 18px;">Prepared for: ${customerName}</p>` : ''}
          </div>

          ${additionalNotes ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
              <strong style="color: #92400e;">Notes:</strong>
              <p style="margin: 8px 0 0 0; color: #78350f;">${additionalNotes}</p>
            </div>
          ` : ''}

          ${plan?.daily_nutrition_target ? `
            <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
              <h3 style="color: #1e40af; margin-top: 0;">Daily Nutrition Targets</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #10b981;">${plan.daily_nutrition_target.calories || 0}</div>
                  <div style="color: #6b7280; font-size: 14px;">Calories</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${plan.daily_nutrition_target.protein_g || 0}g</div>
                  <div style="color: #6b7280; font-size: 14px;">Protein</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${plan.daily_nutrition_target.carbs_g || 0}g</div>
                  <div style="color: #6b7280; font-size: 14px;">Carbs</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${plan.daily_nutrition_target.fat_g || 0}g</div>
                  <div style="color: #6b7280; font-size: 14px;">Fat</div>
                </div>
              </div>
            </div>
          ` : ''}

          ${renderMealSection('Breakfast', plan?.breakfast_options)}
          ${renderMealSection('Lunch', plan?.lunch_options)}
          ${renderMealSection('Dinner', plan?.dinner_options)}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This meal plan is personalized based on your health profile and preferences.</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const html = generateHTMLContent();
      const { uri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(uri, { 
        UTI: '.pdf', 
        mimeType: 'application/pdf',
        dialogTitle: 'Download Meal Plan PDF'
      });

      Alert.alert('Success', 'PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF Error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!customerEmail) {
      Alert.alert('Error', 'Please enter customer email');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      // Generate PDF
      const html = generateHTMLContent();
      const { uri } = await Print.printToFileAsync({ html });

      // Check if mail is available
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('Error', 'Email service is not available on this device');
        setLoading(false);
        return;
      }

      // Compose email with PDF attachment
      const result = await MailComposer.composeAsync({
        recipients: [customerEmail],
        subject: `Your Personalized Meal Plan${customerName ? ` - ${customerName}` : ''}`,
        body: `Hi${customerName ? ` ${customerName}` : ''},\n\nPlease find your personalized meal plan attached as a PDF.\n\n${additionalNotes ? `Additional Notes:\n${additionalNotes}\n\n` : ''}Best regards,\nYour Health Team`,
        attachments: [uri],
      });

      if (result.status === 'sent') {
        Alert.alert('Success', 'Email sent successfully!', [
          { text: 'OK', onPress: handleClose }
        ]);
      }
    } catch (error) {
      console.error('Email Error:', error);
      Alert.alert('Error', 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={false}
      onRequestClose={handleClose}
    >
              <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleClose} 
            style={styles.closeButton}
            disabled={loading}
          >
            <Ionicons name="close" size={28} color={loading ? "#9ca3af" : "#374151"} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Meal Plan</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <Text style={styles.label}>Customer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer name"
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor="#9ca3af"
              editable={!loading}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>
              Customer Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="customer@example.com"
              value={customerEmail}
              onChangeText={setCustomerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
              editable={!loading}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any special instructions or notes..."
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
              editable={!loading}
            />
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Meal Plan Preview</Text>
            <View style={styles.previewBox}>
              <Ionicons name="document-text" size={40} color="#10b981" />
              <Text style={styles.previewText}>
                {mealPlan?.daily_plan?.breakfast_options?.length || 0} Breakfast +{' '}
                {mealPlan?.daily_plan?.lunch_options?.length || 0} Lunch +{' '}
                {mealPlan?.daily_plan?.dinner_options?.length || 0} Dinner options
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.downloadButton, loading && styles.buttonDisabled]}
              onPress={handleDownloadPDF}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Download PDF</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.emailButton, loading && styles.buttonDisabled]}
              onPress={handleSendEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="mail-outline" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Send Email</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
</SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    backgroundColor: Colors.bgCard,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgCard,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  previewBox: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  previewText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.emerald,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  downloadButton: {
    backgroundColor: '#3b82f6',
  },
  emailButton: {
    backgroundColor: Colors.emerald,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.bgPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MealPlanEmailScreen;