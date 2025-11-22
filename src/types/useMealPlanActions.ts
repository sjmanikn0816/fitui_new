import { useState } from "react";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as MailComposer from "expo-mail-composer";
import { Alert } from "react-native";
import { generateHTMLContent } from "../utils/generateHTMLContent";

export const useMealPlanActions = ({
  mealPlan,
  customerEmail,
  customerName,
  additionalNotes,
  onClose,
}: any) => {
  const [loading, setLoading] = useState(false);

  const resetLoading = () => setLoading(false);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const html = generateHTMLContent(mealPlan, customerName, additionalNotes);
      const { uri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
        dialogTitle: "Download Meal Plan PDF",
      });

      Alert.alert("Success", "PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF Error:", error);
      Alert.alert("Error", "Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!customerEmail) {
      Alert.alert("Error", "Please enter customer email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const html = generateHTMLContent(mealPlan, customerName, additionalNotes);
      const { uri } = await Print.printToFileAsync({ html });
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert("Error", "Email service not available on this device");
        setLoading(false);
        return;
      }

      const result = await MailComposer.composeAsync({
        recipients: [customerEmail],
        subject: `Your Personalized Meal Plan${customerName ? ` - ${customerName}` : ""}`,
        body: `Hi${customerName ? ` ${customerName}` : ""},\n\nPlease find your personalized meal plan attached.\n\n${additionalNotes ? `Notes:\n${additionalNotes}\n\n` : ""}Best regards,\nYour Health Team`,
        attachments: [uri],
      });

      if (result.status === "sent") {
        Alert.alert("Success", "Email sent successfully!", [{ text: "OK", onPress: onClose }]);
      }
    } catch (error) {
      console.error("Email Error:", error);
      Alert.alert("Error", "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleDownloadPDF, handleSendEmail, resetLoading };
};
