import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '@/constants/Colors';
import { changePassword, resetPasswordState } from '../../../redux/slice/changePasswordSlice';
import type { RootState, AppDispatch } from '../../../redux/store';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  show: boolean;
  toggleShow: () => void;
  error?: string;
  placeholder: string;
}

interface Errors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ChangePasswordScreenProps {
  navigation: any;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  show,
  toggleShow,
  error,
  placeholder,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, error && styles.inputError]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        secureTextEntry={!show}
        placeholderTextColor={Colors.textMuted}
      />
      <TouchableOpacity onPress={toggleShow} style={styles.eyeButton}>
        <Ionicons
          name={show ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector((state: RootState) => state.changePassword);
  const user = useSelector((state: RootState) => state.auth.user);

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!oldPassword) {
      newErrors.oldPassword = 'Old password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (validateForm()) {
      // Check if user email exists
      if (!user?.email) {
        Alert.alert('Error', 'User email not found. Please login again.');
        return;
      }

      // Dispatch the change password action
      const result = await dispatch(
        changePassword({
          email: user.email,
          oldPassword,
          newPassword,
          confirmPassword,
        })
      );
      console.log(result)

      // Handle success or failure
      if (changePassword.fulfilled.match(result)) {
        Alert.alert('Success', 'Password changed successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Reset inputs
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setErrors({});
              dispatch(resetPasswordState());
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', error || 'Failed to change password');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View>
            <Text style={styles.backText}>Back</Text>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
        </View> */}

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Lock Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={32} color="#EAB308" />
            </View>

            <Text style={styles.title}>Update Your Password</Text>
            <Text style={styles.subtitle}>
              Please enter your current password and choose a new secure password
            </Text>

            {/* Password Inputs */}
            <PasswordInput
              label="Old Password"
              value={oldPassword}
              onChange={setOldPassword}
              show={showOldPassword}
              toggleShow={() => setShowOldPassword(!showOldPassword)}
              error={errors.oldPassword}
              placeholder="Enter your current password"
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              toggleShow={() => setShowNewPassword(!showNewPassword)}
              error={errors.newPassword}
              placeholder="Enter your new password"
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              placeholder="Re-enter your new password"
            />

            {/* Password Requirements */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsText}>
                <Text style={styles.requirementsBold}>Password Requirements:</Text>
                {'\n'}• At least 8 characters long
                {'\n'}• Mix of uppercase and lowercase letters recommended
                {'\n'}• Include numbers and special characters for better security
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Changing Password...' : 'Change Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    backgroundColor: Colors.bgCard,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    color: Colors.emerald,
    fontSize: 12,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  requirementsBox: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  requirementsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  requirementsBold: {
    fontWeight: 'bold',
    color: Colors.emerald,
  },
  submitButton: {
    backgroundColor: Colors.emerald,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.bgPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;